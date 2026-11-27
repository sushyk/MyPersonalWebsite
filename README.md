# Sushil Kumar · personal website

Portfolio site built with [Astro](https://astro.build), deployed to GitHub Pages by GitHub Actions.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321/MyPersonalWebsite/
npm run build    # static output in dist/
npm run preview
```

## Where content lives

| What | File |
|---|---|
| Name, tagline, links, CV toggle | `src/data/site.ts` |
| Azure / AWS section | `src/data/cloud.ts` |
| Experience timeline (hidden while empty) | `src/data/experience.ts` |
| Skills and certifications | `src/data/skills.ts` |
| Case studies | `src/content/projects/*.md` (schema in `src/content.config.ts`) |

To add a project, drop a new Markdown file in `src/content/projects/`. Set `featured: true` to show it as a card, and `cloud: [azure]` / `[aws]` to badge it and list it under that cloud.
