Do this as a parallel multi-agent build.

1. SERIAL PREP first, alone:
   - Branch. Capture a "before" baseline of whatever I'll judge the result on
     (rendered geometry, test output, API snapshot). Without it you can't
     prove later that you changed only what you meant to.
   - Scout the work and list every file that must change.

2. DECOMPOSE BY FILE OWNERSHIP, not by task. Each agent owns specific files
   EXCLUSIVELY. No two agents may touch the same file, so there are no write
   conflicts. If a shared module would force everything through one file,
   prefer editing in place for this pass.

3. PRE-RESOLVE CROSS-FILE COUPLINGS in the prompts. Anywhere two agents' work
   must agree (a shared list, a shared constant, a count that must match),
   decide it yourself and hand both agents the SAME value verbatim. They
   cannot see each other, so anything you don't pre-resolve won't converge.

4. LAUNCH THEM ALL IN ONE MESSAGE so they run concurrently. In each prompt
   state: the files it owns, that other agents are editing siblings
   concurrently, the exact constraints, and that it should push back and
   explain if an instruction looks wrong rather than comply blindly.

5. RECONCILIATION PASS after they land — budget for it. Per-file correctness
   does not compose into coherence; duplicated phrasing, drifted naming and
   contradictory comments are yours to catch because only you see all files.

6. SERIAL VERIFY: build, lint, and diff against the step-1 baseline. Classify
   every difference by root cause instead of listing them; most of a large
   diff is one change cascading. Anything unexplained is a bug, not noise.

Report what each agent changed, what you reconciled, and anything an agent
flagged that you couldn't resolve.
