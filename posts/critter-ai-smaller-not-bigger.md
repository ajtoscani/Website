---
title: "Why my critter AI got smaller, not bigger."
date: 2026-02-14
project: cbc
type: devlog
read_time: 6
published: true
dek: "The behavior tree I started with was a class with too many friends. Five small pieces later, the critters know what to do."
tags:
  - ai
  - architecture
  - state-tree
---

The first version of the critter AI in Cardboard Critters was a class. Just one. It had references to the GardenManager, to the SpawnPoint, to its own Definition asset, to a State Tree, to some condition objects, and to a debug logger nobody asked for. Adding a one-line behavior — say, *"prefer flowers over crops on rainy days"* — meant editing four files and three structs.

This is the version I'm running now, after a small architectural fight with myself.

## The five pieces

The current critter system is five things, and none of them know much about each other:

1. **`UCritterDefinition`** — a data asset. Static stuff. What this critter is, how fast it moves, what it eats, what it likes.
2. **`UCritterData`** — runtime state. What this *particular* critter is doing now, what it remembers, who it's with.
3. **`UGardenCondition`** — a small evaluator. Implements `BlueprintNativeEvent` `Evaluate` and `FindTarget`. Each condition is its own asset.
4. **`AGardenSpawnPoint`** — a spline-based path actor. Critters follow it on the way in and on the way out.
5. **A State Tree** — drives moment-to-moment behavior. Sits on top of the rest.

Most behaviors live in the State Tree. When the State Tree wants to know *should this critter visit the garden*, it asks a `UGardenCondition`. When it wants to know *where should it walk*, it asks an `AGardenSpawnPoint`. When it wants to know *what kind of thing am I*, it reads the `UCritterDefinition`. The runtime memory lives in `UCritterData`.

> If a one-line behavior costs five files to add, the architecture is wrong.

The point isn't that five classes is the magic number. It's that each of these classes does one thing, and adding a new behavior adds one new asset of one type — usually a `UGardenCondition` — without touching anything else.

## What this looked like before

The same logic, in the previous version, lived inside one `ACritter` class. It looked something like this:

```cpp
// before — one class, lots of friends
class ACritter : public APawn
{
    UPROPERTY() UCritterDefinition* Def;
    UPROPERTY() AGardenManager* Garden;
    UPROPERTY() AGardenSpawnPoint* Spawn;
    UPROPERTY() UStateTreeComponent* StateTree;
    
    bool ShouldVisit() const;
    bool ShouldStay() const;
    bool ShouldLeave() const;
    void EvaluateGarden();
    void EvaluateWeather();
    void EvaluateSeason();
    // ...and twelve more
};
```

Every `ShouldX()` call had to know about the GardenManager, the WeatherManager, the DayManager, and the season-tracking state, because the rules touched all of them. The class wasn't doing too much — but it was *holding* too much. Every new behavior pulled in a new dependency.

## What it looks like now

```cpp
// after — small piece, narrow surface
UCLASS(Blueprintable, Abstract)
class UGardenCondition : public UObject
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintNativeEvent)
    bool Evaluate(const FGardenContext& Ctx) const;

    UFUNCTION(BlueprintNativeEvent)
    AActor* FindTarget(const FGardenContext& Ctx) const;
};
```

A condition is one asset, two functions, one context struct. It doesn't know what a critter is. It doesn't know about a State Tree. It evaluates a question against a snapshot of the world.

Adding the *"prefer flowers over crops on rainy days"* rule, in the new system, is a single asset. Evaluate becomes:

```cpp
bool UCondition_PreferFlowersWhenWet::Evaluate_Implementation(const FGardenContext& Ctx) const
{
    return Ctx.Weather.bIsRaining && Ctx.AvailableTargets.HasFlowers();
}
```

I drop the asset on the State Tree node that selects targets. Done. Critter does the new thing.

## What got cut

A bunch of things, and the cut list is interesting:

- A `UCritterBrain` class that was supposed to coordinate decisions across critters. Removed. Critters don't need to coordinate; they need to evaluate the world independently. Coordination, when I want it, can come from a separate `AGardenManager` event, not from per-critter wiring.
- An "intent" enum that critters carried as a current goal. The State Tree turned out to model this perfectly without an extra enum, and the enum was wrong half the time anyway.
- Three different kinds of debug logger. Folded into one.

This is most of what good architecture looks like in practice — not adding the right things, but removing the wrong ones.

## The smaller lesson

I keep finding that good gameplay code has the shape of *small pieces with narrow surfaces*. When something feels hard to add, it's almost always because two of the pieces are talking to each other when they shouldn't be. Cut the conversation, and the new thing slots in clean.

The critters are doing their thing in the garden right now. I added two new conditions yesterday in about ten minutes apiece, which is the only test that matters.
