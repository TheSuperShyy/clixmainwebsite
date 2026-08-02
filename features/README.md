# Features

One folder per section of the target site. Each folder is self-contained:

```
features/<slug>/
├── FEATURE.md      spec — measured values, tokens, deviations, acceptance checklist
├── CONTEXT.md      memory — dated log of what was done and why
└── assets/         reference screenshots, extracted images, fonts
```

Create a folder by copying both templates:

```powershell
$slug = "hero"
New-Item -ItemType Directory -Force "features/$slug/assets" | Out-Null
Copy-Item "docs/templates/FEATURE.template.md" "features/$slug/FEATURE.md"
Copy-Item "docs/templates/CONTEXT.template.md" "features/$slug/CONTEXT.md"
```

Rules:

- **Never** create a feature folder with only one of the two files.
- Slugs are kebab-case and match the `Slug` column in [docs/SECTIONS.md](../docs/SECTIONS.md).
- Reference screenshots are named `ref-1600.png`, `ref-1440.png`, `ref-1024.png`,
  `ref-390.png` — one per Framer breakpoint tier (see `docs/PROJECT.md`).
- Everything needed to resume a section lives here — don't rely on chat history.
