# addison.dev

Personal portfolio site for Addison — solo indie game developer. Built with [Eleventy](https://www.11ty.dev/), no JavaScript framework, no build step beyond Eleventy itself.

## Quick start

```bash
npm install
npm run serve    # local dev server with live reload
npm run build    # static build into _site/
```

Output goes to `_site/`. Drop that folder on Netlify, Cloudflare Pages, GitHub Pages, or any static host.

## Adding a devlog post

Create a new markdown file in `posts/`:

```markdown
---
title: "How I fixed the spline thing."
date: 2026-05-12
project: cbc           # cbc, gg, or omit for none
type: devlog           # devlog, tutorial, or note
read_time: 7
youtube_id: "abc123"   # optional — shows an embedded video
published: true        # set false to hide while drafting
dek: "A short tagline shown on the index and at the top of the post."
tags:
  - splines
  - level-design
---

Body content in markdown. Headings, paragraphs, lists, code, blockquotes, all work.

## Subheading

Regular paragraph here.

> Pull quotes look like this.

- Bullet lists
- Use a long-dash bullet automatically

```cpp
// code blocks get syntax highlighting
void DoTheThing();
```
```

Then run `npm run build`. The post appears on the devlog index, gets prev/next nav linked through the collection, shows up on the homepage if it's one of the latest three, and lives at `/devlog/{filename-slug}/`.

To unpublish a post temporarily, set `published: false`. Leave it in the folder; it just won't render.

## Adding a project (a new "planet")

Two steps:

1. Open `.eleventy.js` and add the project to the `projects` object:

```javascript
const projects = {
  cbc: { name: "Cardboard Critters", label: "CBC", color: "#7AB069", colorLight: "#A8D89A" },
  gg:  { name: "Goblin's Greed", label: "GG", color: "#9B7DB8", colorLight: "#B89DCB" },
  newproject: {
    name: "New Project",
    label: "NP",
    color: "#someColor",
    colorLight: "#someLighterColor"
  }
};
```

2. Create the case study at `work/new-project.njk`. Use `work/cardboard-critters.njk` or `work/goblins-greed.njk` as a template. Set `accent: newproject` in frontmatter to apply the planet's color across the page.

The new project key (e.g. `newproject`) can then be used in any post's `project:` frontmatter, and the dot color is automatic.

## File structure

```
.
├── package.json              # Eleventy + plugins
├── .eleventy.js              # Config — collections, filters, project metadata
├── _includes/
│   ├── base.njk              # Page shell (head, nav, footer)
│   ├── post.njk              # Blog post layout
│   └── partials/
│       ├── nav.njk           # Site navigation
│       ├── footer.njk        # Site footer
│       ├── constellation.njk # Wayfinding indicator macro
│       └── stars.njk         # Reusable star field SVG
├── assets/
│   └── css/main.css          # All styles, organized into sections
├── index.njk                 # Homepage with solar system
├── about.njk                 # About page
├── contact.njk               # Contact page
├── devlog.njk                # Devlog index
├── work/                     # Case studies (one file per project)
└── posts/                    # Devlog content (markdown)
    └── posts.json            # Applies post layout + permalink to all posts
```

## Customizing

- **Colors and design tokens**: top of `assets/css/main.css`, in `:root { ... }`.
- **Per-page accent color**: `data-accent` attribute, set via the `accent:` frontmatter on each page (`sun`, `cbc`, `gg`).
- **Nav links**: `_includes/partials/nav.njk`.
- **Social links in the footer**: `_includes/partials/footer.njk`.
- **Hero text on the homepage**: `index.njk`.
- **Bio on the about page**: `about.njk`.

## Deploying

The site is fully static. After `npm run build`, the `_site/` folder is the entire site. Common options:

- **Netlify**: Connect the repo, build command `npm run build`, publish directory `_site`.
- **Cloudflare Pages**: same — `npm run build`, output `_site`.
- **GitHub Pages**: build locally or via Actions, push the `_site` contents to your `gh-pages` branch.
- **Self-hosted**: copy `_site/` to your server.

## Notes

- No JavaScript framework. The only inline JS on the site is the devlog filter chip toggle (~15 lines).
- All animations are CSS or native SVG (`animateTransform`). Respects `prefers-reduced-motion`.
- All planet illustrations are inline SVG — no image assets to manage. Edit them directly in the page templates if you want to tweak.
- The constellation indicator (`_includes/partials/constellation.njk`) is a single macro reused across pages with different highlights. To add a new project to the constellation, edit that file.
