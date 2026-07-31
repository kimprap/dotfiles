# Design It Twice

When the user wants to explore alternative interfaces for a chosen deepening candidate, use this approved bounded design-batch pattern. Based on "Design It Twice" (Ousterhout)—your first idea is unlikely to be the best.

Uses the vocabulary in [SKILL.md](SKILL.md) — **module**, **interface**, **seam**, **adapter**, **leverage**.

## Process

### 1. Frame the problem space

Before any design attempt, require a current approved Route Overview and Task Contract that authorize a bounded independent batch, name the fixed constraints, and bind the current lifecycle/backend owner. If design state is coupled or the capability profile lacks an equivalent safe batch, keep one owner or return `authority-change-required`; this reference never escalates topology itself.

- The constraints any new interface would need to satisfy
- The dependencies it would rely on, and which category they fall into (see [DEEPENING.md](DEEPENING.md))
- A rough illustrative code sketch to ground the constraints — not a proposal, just a way to make the constraints concrete

Show this to the user and obtain approval of the exact problem space, mode, and fixed constraints before Step 2.

### 2. Dispatch bounded design attempts

Have the approved execution backend dispatch three or more independent design attempts using the host's verified capability, without naming a provider tool or claiming unavailable parallelism. Each attempt receives an immutable Task Contract and Context Pack and returns a common Handoff. No attempt may observe sibling work.

Give each attempt a separate technical brief: file paths, coupling details, dependency category from [DEEPENING.md](DEEPENING.md), what sits behind the seam, and the fixed constraints approved in Step 1. Give each attempt a different design constraint:

- Agent 1: "Minimize the interface — aim for 1–3 entry points max. Maximise leverage per entry point."
- Agent 2: "Maximise flexibility — support many use cases and extension."
- Agent 3: "Optimise for the most common caller — make the default case trivial."
- Agent 4 (if applicable): "Design around ports & adapters for cross-seam dependencies."

Include both [SKILL.md](SKILL.md) vocabulary and `CONTEXT.md` vocabulary in each Context Pack so every attempt names things consistently with the architecture and domain language.

Each attempt returns:

1. Interface (types, methods, params — plus invariants, ordering, error modes)
2. Usage example showing how callers use it
3. What the implementation hides behind the seam
4. Dependency strategy and adapters (see [DEEPENING.md](DEEPENING.md))
5. Trade-offs — where leverage is high, where it's thin

### 3. Present and compare

Present designs sequentially so the user can absorb each one, then compare them in prose. Contrast by **depth** (leverage at the interface), **locality** (where change concentrates), and **seam placement**.

After comparing, give your own recommendation: which design you think is strongest and why. If elements from different designs would combine well, propose a hybrid. Be opinionated — the user wants a strong read, not a menu.
