# Project Skills

Skills sent for this project are installed here and auto-discovered by Claude Code.

```
.claude/skills/<kebab-name>/
├── SKILL.md         required — instructions + YAML frontmatter
├── references/      optional — docs loaded on demand
├── scripts/         optional
└── assets/          optional
```

`SKILL.md` frontmatter:

```yaml
---
name: <kebab-name>
description: What it does AND when to trigger it. This line is the only text used to
  decide relevance, so state triggers explicitly.
---
```

Installing a skill is not finished until it is registered in
[docs/SKILLS.md](../../docs/SKILLS.md) with a concrete trigger condition, and logged in
[docs/CONTEXT.md](../../docs/CONTEXT.md). Full procedure: **CLAUDE.md §4**.

Invoke a skill by name with the Skill tool, or `/<name>` in chat.
