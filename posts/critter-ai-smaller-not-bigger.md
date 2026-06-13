---
title: "Why my critter AI got smaller, not bigger."
date: 2026-04-14
project: cbc
type: devlog
published: true
dek: "From one class with too many friends to a handful of pieces that don't know much about each other."
tags:
  - ai
  - architecture
  - data-assets
---

## The pieces

The current critter system is a small hierarchy of data assets and one predicate type, all of which know as little as possible about each other.

**`UCritterDefinition`** is the identity asset. Name, description, portrait, and the actor class to spawn. It doesn't carry behavior itself — it just points at the data assets that do. Currently that's:

- **`UCritterData`** — everything garden-side. Appearance (mesh, anim BP, material overrides), spawning rules (which day states the critter is eligible in, which weather blocks or requires it, selection weights, simultaneous limits), visit duration, the conditions for entering and staying, and behavior maps keyed by activity, day state, and weather.
- **`UCritterCombatData`** — the same idea for combat. Separate asset, separate concerns, designed by the same hands but reasoned about in isolation.

**`UGardenCondition`** is an abstract `UObject` with two `BlueprintNativeEvent` methods: `Evaluate(garden, critter)` and `FindTarget(garden, critter)`. Each concrete condition is its own subclass, marked `EditInlineNew` so it can be authored inline inside whichever `CritterData` references it — no separate asset file required per condition. Conditions don't know about each other; they just answer questions about a garden.

The Critter actor itself does what pawns do — moves, animates, looks at things. It reads from its `CritterData` and lets the State Tree make decisions. The actor is small.

## What this looked like before

The same logic, in the previous version, lived inside one `ACritter` class. Something like this:

```cpp
// before — one class, lots of friends
class ACritter : public APawn
{
    UPROPERTY() UCritterDefinition* Def;
    UPROPERTY() AGardenGrid* Garden;
    UPROPERTY() UStateTreeComponent* StateTree;

    bool ShouldVisit() const;
    bool ShouldStay() const;
    bool ShouldLeave() const;
    void EvaluateWeather();
    void EvaluateDayState();
    // ...and a dozen more
};
```

Every `ShouldX()` call had to know about the GardenGrid, the weather, the day state, the season tracker, because the rules touched all of them. The class wasn't doing too much — but it was *holding* too much. Every new behavior pulled in a new dependency.

## What it looks like now

```cpp
// after — small piece, narrow surface
UCLASS(Abstract, Blueprintable, EditInlineNew)
class CBC_API UGardenCondition : public UObject
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintNativeEvent, BlueprintCallable)
    bool Evaluate(AGardenGrid* Garden, ACritter* Critter = nullptr) const;

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable)
    AActor* FindTarget(AGardenGrid* Garden, ACritter* Critter = nullptr);
};
```

A condition is one type, two functions, two arguments. It doesn't know what a state tree is. It doesn't know what a behavior config is. It evaluates a question against a garden and (optionally) a critter, and returns yes/no or a target.

Adding the *"wants X amount of Soil"* rule, in the new system, is a single condition subclass. The implementation is one line:

```cpp
bool UGardenCondition_TileCount::Evaluate_Implementation(AGardenGrid* Garden,  ACritter* Critter) const
{
	if (!Garden ) return false;
	return Garden->GetCoverageCount(RequiredTileType) >= RequiredCount;
}
```

Drop the condition inline into the relevant `CritterData`'s `VisitConditions` or `ResidentConditions` array. Done.

The split between `VisitConditions` and `ResidentConditions` is one of the smaller wins from this refactor — *will this critter consider visiting at all* and *will this critter stay long-term* are different questions with different answers, and treating them as the same question made the original logic worse than it needed to be.

## The smaller lesson

I keep finding that good gameplay code has the shape of *small pieces with narrow surfaces*. When something feels hard to add, it's almost always because two pieces are talking to each other when they shouldn't be. Cut the conversation, and the new thing slots in clean.

Adding a new condition now is a single subclass and a few lines of evaluation logic. That's the test that matters.