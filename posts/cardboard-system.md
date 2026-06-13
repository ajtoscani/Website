---
title: "The cardboard isn't a texture. It's a system."
date: 2026-04-21
project: cbc
type: devlog

dek: "Cardboard Critters' material started as a torn-paper shader and turned into a small architecture for wear."
tags:
  - materials
  - unreal-5
  - architecture
---

When I started Cardboard Critters, I thought of the cardboard look as a texture problem. Pick a paper material, apply a torn-edge mask, done. Three weeks in, I had something that looked like cardboard from one angle and like a flat decal from every other one. The texture had no system behind it.

This is the post about what changed.

## The thing I was actually missing

A real piece of cardboard in the world doesn't have *a* state. It has a state at the front, a state in the seams, a state where the edge folds, and a state under the layer of paint that's started peeling off. What you read as "cardboard" is a composite of those local states.

Trying to bake all of that into a single texture meant choosing a single moment in the cardboard's life. Which was fine for a hero prop. Useless for a hundred critters that need to weather over time.

## Three layers, one wear scalar

What's running in the engine right now is a Master Material that composites three layers. From top to bottom:

- **Surface** — the fresh paper face, with its print and grain.
- **Torn** — the middle state. Edges visibly stressed, paint flaking, fibers showing.
- **Background** — raw, undecorated board. What you see when the upper layers fail.

Per-instance Custom Primitive Data drives a single `Wear` scalar from 0 to 1. The material composites the layers based on that value, weighted by a fragmentation mask that makes failure look local rather than uniform — the surface gives way at edges and seams first, then spreads.

<figure class="scrub-demo" data-usable-end="0.87">
  <div class="scrub-demo-stage">
    <video class="scrub-demo-video"
           src="/assets/videos/posts/cardboard-wear-progression.mp4"
           preload="auto"
           playsinline
           muted
           aria-label="Cardboard material wear progression from fresh to fully worn"></video>
  </div>
  <div class="scrub-demo-controls">
    <span class="scrub-demo-label">Wear</span>
    <input type="range" min="0" max="1000" value="0" class="scrub-demo-slider" aria-label="Wear amount">
    <span class="scrub-demo-readout"><span class="scrub-demo-value">0</span>%</span>
  </div>
  <figcaption>Drag the slider to scrub the wear scalar from fresh to fully worn.</figcaption>
</figure>


## What's not in yet

Two pieces are still on the wall in the studio rather than in the engine.

- **A sticker atlas.** Per-critter decoration — labels, stamps, scrawls — drawn from an atlas via a per-instance index. This is what'll give each critter a little personality without authoring variants by hand.
- **Wetness response.** Rain should darken the albedo, knock the roughness down, and probably push the wear value forward. The plan is to read from a weather scalar that the GardenManager writes once per tick. Whether I attempt geometry deformation for soggy droop is a separate question — my prototypes of that have read more "broken" than "wet."

