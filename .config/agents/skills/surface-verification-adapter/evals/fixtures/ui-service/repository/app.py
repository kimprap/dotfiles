#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import signal
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, cast


class FixtureServer(ThreadingHTTPServer):
    def __init__(
        self,
        server_address: tuple[str, int],
        handler: type[BaseHTTPRequestHandler],
        data_root: Path,
        static_root: Path,
    ) -> None:
        super().__init__(server_address, handler)
        self.data_root = data_root
        self.static_root = static_root


class Handler(BaseHTTPRequestHandler):
    @property
    def fixture_server(self) -> FixtureServer:
        return cast(FixtureServer, self.server)

    def _json(self, status: HTTPStatus, value: dict[str, Any]) -> None:
        payload = json.dumps(value, separators=(",", ":"), sort_keys=True).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self) -> None:
        if self.path == "/health":
            self._json(HTTPStatus.OK, {"status": "ready"})
            return
        if self.path == "/state":
            state_path = self.fixture_server.data_root / "state.json"
            value = (
                json.loads(state_path.read_text())
                if state_path.exists()
                else {"value": None}
            )
            self._json(HTTPStatus.OK, value)
            return
        if self.path == "/":
            payload = (self.fixture_server.static_root / "index.html").read_bytes()
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        self._json(HTTPStatus.NOT_FOUND, {"error": "not_found"})

    def do_POST(self) -> None:
        if self.path != "/submit":
            self._json(HTTPStatus.NOT_FOUND, {"error": "not_found"})
            return
        length = int(self.headers.get("Content-Length", "0"))
        try:
            request = json.loads(self.rfile.read(length))
            value = request["value"]
            if not isinstance(value, str) or not value:
                raise ValueError
        except (json.JSONDecodeError, KeyError, ValueError):
            self._json(HTTPStatus.BAD_REQUEST, {"error": "invalid_value"})
            return
        self.fixture_server.data_root.mkdir(parents=True, exist_ok=True)
        state = {"value": value}
        (self.fixture_server.data_root / "state.json").write_text(
            json.dumps(state, separators=(",", ":"), sort_keys=True) + "\n"
        )
        self._json(HTTPStatus.OK, {"acknowledged": value})

    def log_message(self, format: str, *args: object) -> None:
        return


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, required=True)
    parser.add_argument("--data-root", type=Path, required=True)
    args = parser.parse_args()
    server = FixtureServer(
        (args.host, args.port),
        Handler,
        args.data_root,
        Path(__file__).with_name("static"),
    )

    def stop(_signum: int, _frame: object) -> None:
        raise KeyboardInterrupt

    signal.signal(signal.SIGTERM, stop)
    print(
        json.dumps({"host": args.host, "port": server.server_port, "status": "ready"}),
        flush=True,
    )
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
