# Requirements

- R1: A backup never overwrites an earlier backup.
- R2: A symlink that already points at the correct source is left alone.
- R3: The path check accepts only `.config/<name>`, `bin`, `manifest` and `README.md`, and rejects anything containing `..`.
