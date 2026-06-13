---
title: "Why I shelved Goblin's Greed."
date: 2026-03-31
project: gg
type: devlog
published: true
dek: "Six months of solo development on a co-op dungeon crawler — and the Steam tag data that finally talked me out of finishing it."
tags:
  - post-mortem
  - market
  - solo-dev
---

I think the version of this story most people would want me to tell is the technical one. The bug that wouldn't die. The architecture that buckled. The scope that ate itself. There's something tidy about a project failing for reasons you can put on a slide.

The reason I shelved Goblin's Greed isn't that one. It's quieter and a little more uncomfortable, and it's the one I think actually matters.

## What I built

Goblin's Greed was a four-player co-op dungeon crawler. You and three friends ran procedurally-generated dungeons, fought various enemies and avoided traps, and tried not to lose all your loot before returning to the goblin chief. Six months of work, October 2025 through March 2026.

The systems were the most ambitious thing I'd created. GAS-driven combat with custom ability tasks. Server-authoritative replication that actually felt good on a network. Procedural rooms that retried generation when a layout dead-ended, all from the Game Instance, invisibly. Trap chains, shop transactions, ragdoll deaths — the whole tour.

It worked. Not perfectly, but it worked.

## What I should have done first

Before the first commit, I should have spent a weekend with a spreadsheet on Steam.

I didn't, because I knew the genre. I had played the games I was inspired by. I had a vision of where this one would sit. Vision is a great way to start a project and a terrible way to validate one, and I learned the difference the way most solo developers do — late.

When I finally did sit down with the data, in February, what I found was a category that had become loud. Co-op crowd-pleasers in this exact subspace had been a goldrush for two years. Multiple recent hits, dozens of imitators, and the price-points compressing fast. The tag co-occurrence matrix made my game look like a dot in a crowd of dots, and the dots were all visibly cheaper, more polished, or more famous than I could be solo.

You can argue about Steam tags as a signal — they're noisy, they're gameable, they don't capture quality — but the trend across multiple sources was the same. The window I had imagined for a small co-op dungeon crawler in 2026 was not, in fact, open.

## The weeks I argued with myself

I tried to talk myself out of it for about three weeks. The arguments were the usual ones.

I was already this far in. I'd be wasting six months. If I just polished the differentiator harder. If I marketed cleverly. If I leaned into the goblins being the actual hook. If I priced low. If I did Early Access. If I, if I, if I.

The thing about sunk cost is that it'll keep arguing with you for as long as you let it. The thing that finally settled it was a question I asked myself in front of the spreadsheet: if I were starting today, knowing what I know now, would I start *this* project?

I would not.

## What "concluding" actually meant

I want to be careful with the word *shelved*. I didn't burn the repo. I didn't delete the discord. I wrote a clean post-mortem internally, archived the project with notes, and kept the systems I might use again — particularly the GAS combat and the procedural room generator, which are reusable in shapes I haven't picked yet.

What I gave up was the next eighteen to twenty-four months of solo work on a thing the market had told me wasn't going to land. That's the cost. Not zero, but not infinite either.

> The hardest part of being a solo developer isn't building the thing. It's reading the market well enough to know which thing is worth building.

## What I'd tell someone six months ago

Read the market first. Not last. Not "after the prototype works." First, before you've sunk any pride into it.

The numbers won't tell you what to make. But they will tell you, very clearly, where you'll be invisible. Being invisible isn't a marketing problem you can outwork — it's a positioning problem you have to solve before you start.

I also wouldn't tell anyone to never make a co-op dungeon crawler. I'd tell them to make sure they have the budget, the team, or the angle to compete in that crowd, because the crowd is real and it's not getting smaller.

## What's next

Cardboard Critters. A cozy garden game with paper-crafted creatures and a material system that ages on its own. I picked it the same way you should pick anything else — by reading the data first, then asking whether I had something to say in that space, and only then committing.

The systems work I'm doing on it is genuinely some of the best I've ever written. I'm not sure that would feel as good if I hadn't gone through this first.

## A small acknowledgment

To the friends made during Goblin's Greed development: thank you. Sincerely. The constant support made every day worth it. None of that work is wasted, even if the project is.

The dungeon stays on the shelf. The lessons come with me.
