---
title: "Digging holes that aren't square."
date: 2026-06-09
project: cbc
type: devlog
published: true
dek: "Refactoring Cardboard Critters' terrain onto a signed distance field — and what happened when holes started looking like holes."
tags:
  - terrain
  - sdf
  - unreal-5
  - dynamic-mesh
---

# Why I Switched to SDFs for My Garden Terrain

When I first built the terrain system for Cardboard Critters, I went with the obvious approach: paint to render targets. Soil is one texture, grass is another, you stamp circles when the player digs or paints. It mostly worked, but three things started to nag at me:

1. **Drag-painting left gaps.** Brush stamps spaced just far enough apart to show little holes between them, like pearls on a string.
2. **Edges looked stamped.** Every paint operation left a visible cosine-falloff circle. Multiple operations stacked into a union of circles, not an organic landscape.

So I rebuilt the geometric layer around a **signed distance field** — a 2D grid where each cell stores how far below ground level it is. Negative values mean the ground has been dug down. Water appears automatically wherever a cell drops below the water plane. The terrain mesh is deformed directly by the SDF, so holes have real depth.

What this bought me:

- **Real geometry.** Dug holes are actual depressions you can see in profile. Filling raises them back up.
- **Shapes that union correctly.** Two overlapping digs don't look like two circles; they look like one bigger organic depression with a smooth combined outline.
- **One source of truth for terrain physics.** "Is this point underwater?" is a single SDF sample, not a guess based on what's painted.

The bigger lesson, though, was learning when *not* to use it.

I tried using the SDF to drive grass visibility too — clearing grass wherever the SDF said "modified." Sounded clean on paper. But every time the SDF changed (blur smoothed things out, fill raised them up, a new dig deepened the area), the grass boundary would shift around in surprising ways. It kept *moving*.

So I split the architecture: **SDF for the geometric stuff that should be fluid like terrain shape, render targets for the visual stuff that should stay put (grass, painted soil).** The two layers cooperate where useful — when you dig, I snapshot the SDF's current shape and stamp it into the grass texture once, baking that shape in permanently. After that, the SDF can keep evolving without disturbing the grass at all.

Was the conversion worth it? Easily. Holes look like holes. Water pools. Edges blend organically. Physics queries hit one source of truth, visuals decorate cleanly on top.

If you're starting a project with terrain that needs depth and fluidity, skip the paint-only phase. Go SDF first — and remember that the win comes from knowing which problems are geometric and which aren't.