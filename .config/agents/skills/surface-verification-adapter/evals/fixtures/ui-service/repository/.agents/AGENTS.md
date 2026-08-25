# UI service fixture

- Repository-owned skills live under `.agents/skills/`.
- Launch `app.py` with an assigned `--port` and isolated `--data-root`.
- Stable user paths are `/`, `/submit`, and `/state`.
- Evidence must outlive process and scratch cleanup.
- A broken service is product evidence; an adapter must not repair it.
