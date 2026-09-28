# Maintenance journal convention

A conforming `MAINTENANCE.md` is append-only, non-runtime, and noncanonical. Structured entries and source rows may coexist with optional free-form maintenance notes. Executable skill or rule prose, approved artifacts, and active ADRs remain authoritative; discovery, invocation, and runtime execution never load or interpret the journal.

## Structured entries

Every structured entry records:

- a stable identity and kind;
- `Supersedes: none` or the exact superseded entry IDs;
- context;
- decision;
- applied paths;
- rejected alternatives;
- validation; and
- a revisit condition.

## Source rows

Every source row records the exact source URL or stable local URI, access date, `Use: adopted | adapted | caution | rejected | superseded`, `Basis: local evidence | primary source | secondary source | unverified`, applied path, and concise local treatment. A source row records provenance; it does not import an article or create runtime policy.

## Corrections and exclusions

Later corrections append a new entry with `Supersedes`; never rewrite or delete earlier history. Do not store raw transcripts, copied articles, provider trivia, or numeric source scores. Preserve every existing journal entry byte-for-byte unless the explicit task is to append a conforming correction.
