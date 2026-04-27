---
title: "The cardboard isn't a texture. It's a system."
date: 2026-03-21
project: cbc
type: devlog
read_time: 8
published: true
dek: "How Cardboard Critters' material pipeline started as a single shader and grew into a small architecture for weathering."
tags:
  - materials
  - unreal-5
  - architecture
---

When I started Cardboard Critters, I thought of the cardboard look as a texture problem. Pick a paper material, apply a torn-edge mask, call it a day. Three weeks in, I had something that looked like cardboard from one angle and like a flat decal from every other one. The texture had no system behind it.

This is the post about what changed.

## The thing I was actually missing

A real piece of cardboard in the world doesn't have *a* state. It has a state at the front, a state in the seams, a state where the edge folds, and a state under the layer of paint that's started peeling off. What you read as "cardboard" is a composite of those local states.

Trying to bake all of that into a single texture meant choosing a single moment in the cardboard's life. Which was fine for a hero prop. Useless for a hundred critters living through changing seasons.

## Three layers, in order

What works in the current build is a Master Material that composites three layers, with per-instance data driving where each instance falls on the wear curve.

The layers, from top to bottom:

- **Surface** — the fresh paper face, with stickers, paint, and stamping.
- **Torn** — the middle state. Edges visibly stressed, paint flaking, fibers showing.
- **Background** — raw, undecorated board. What you see when the upper layers fail.

Per-instance Custom Primitive Data drives a single `Wear` scalar from 0 to 1. The material samples each layer, then uses a chain of `If` nodes to blend between them based on the wear value. Cheap to evaluate, easy to author.

> If a one-line behavior costs five files to add, the architecture is wrong.

I keep coming back to that idea — first about the critters, now about this. The first version of this material had four layers and a normal-map blend. It was almost impossible to reason about. Cutting one layer made every other one stronger.

## What broke when I tried to ship it

The interesting failures came when I tried to put this on a Skeletal Mesh and discovered that `PerInstanceRandom` doesn't work the way you'd hope on skeletal components. The atlas sticker variation I wanted — every critter wearing a different label — needed a different pipe.

I ended up using a Dynamic Material Instance per critter and writing the atlas index from C++ at spawn. Slightly more expensive, but it lets each critter carry its own personality and means I can hand-pick stickers for important critters and randomize the rest.

```cpp
void ACritter::ApplyDecoration(int32 StickerIndex)
{
    UMaterialInstanceDynamic* MID = Mesh->CreateDynamicMaterialInstance(0);
    if (MID)
    {
        MID->SetScalarParameterValue(TEXT("StickerIndex"), StickerIndex);
        MID->SetScalarParameterValue(TEXT("Wear"), CachedWear);
    }
}
```

A small amount of code, exactly where the data should be set. Most of the *system* lives in the material; the C++ just flips switches.

## What weather did to the picture

The next layer was wetness. I wanted rain to actually do something to the cardboard — darker, slightly soggy, a little misshapen.

The albedo darkening was straightforward. World Position Offset drooping was not. After two days of trying to make it look good, I cut it. The drooping read as broken, not wet, in basically every pose I tested. The wet albedo plus a faint crayon-bleed did most of the work I'd hoped WPO would do, at a fraction of the cost.

This is the part of materials work I find genuinely fun: figuring out which two effects, stacked, do the work of five.

## What I have now

What I have now is a Master Material that composites three layers, a sticker atlas with about thirty options, and a wear value that ages naturally as critters live in your garden. New critter species inherit the system for free — they bring their own atlas and their own wear curve constants, and the rest just works.

It is, finally, a system. Not a texture.

## What I'd do differently

I'd start by drawing the architecture diagram, not the shader. I spent a week tweaking texture brightness curves before I admitted that I needed three layers, not three texture variants. Architecture comes first, even for art.

The other thing I'd do differently is to write down which versions of the system I was *cutting from* rather than building toward. Half of what looks deliberate in this material is actually the result of removing things that weren't earning their slot.

That's most of game development, honestly. Knowing what to throw out.
