# Process overview

## What I built

I built a browser-based theremin that turns the page into a live musical instrument using the Web Audio API. The player uses pointer, touch, or keyboard input to create and shape sound directly in the browser rather than triggering prerecorded audio. I chose a theremin-style interaction because continuous movement gives the player expressive control without requiring musical knowledge, while constrained and smoothed sound mappings make it difficult to produce an obviously “wrong” result.

## The moments that mattered

### 1. I chose continuous control instead of a button-based instrument

The first important decision was the form of the instrument. A chord-pad grid or sequencer would have been easier to make predictable, but those interactions would mostly involve selecting predefined sounds. I chose a theremin because the player's movement itself could become the performance. This better matched the brief's requirement that two people using the same page should naturally sound different.

I directed the agent around the experience rather than only the implementation:

> Choose Theremin. Build it as an expressive, low-friction browser instrument. Prioritise immediate first-sound interaction, smooth parameter transitions, no “wrong” notes, and visual feedback tied to the sound.

Before accepting the implementation, I approached the page without relying on instructions and checked whether its opening state encouraged me to interact immediately. I also checked that pointer movement meaningfully changed the result instead of functioning like a disguised play button.

[`3c7dea5`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-CongyuLiu09/commit/3c7dea5)

### 2. Passing the audio requirements was not enough to make it playable

The starter already provided Crit 4 invariant tests for live audio and multi-input playability. Those tests gave the implementation a useful technical floor: the work needed live Web Audio behaviour and appropriate input paths rather than prerecorded playback.

[`8ade8e2`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-CongyuLiu09/commit/8ade8e2)

However, those checks could not answer the more important sensory questions: whether pitch changes felt too abrupt, whether the sound became harsh, or whether controlling it required excessive precision. Instead of treating a technically working oscillator as finished, I used repeated listening as an additional acceptance check.

I directed the agent to avoid raw, abrupt mappings:

> Do not just map every pointer update directly to an abrupt frequency change. Smooth the transitions and constrain the musical range so free movement remains expressive without becoming unpleasant or excessively sensitive.

I tested this by making slow movements, very small movements, and fast movements across the page. I listened for sudden jumps, clicks, uncomfortable frequencies, and whether the instrument still responded clearly to different gestures.

[`3c7dea5`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-CongyuLiu09/commit/3c7dea5)

### 3. My ear became part of the harness

The main correction to my process this week was recognising that automated checks could verify implementation properties but could not judge the quality of the musical interaction. An `AudioContext` can exist, input handlers can work, and all invariant checks can pass while the resulting instrument still feels bad to play.

The existing harness gave me structural constraints to work against:

[`d911c06...8ade8e2`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-CongyuLiu09/compare/d911c06...8ade8e2)

I added human play-testing on top of that harness. After the agent produced the instrument, I did not accept the result based only on whether the code built. I repeatedly played it and evaluated latency, sensitivity, tonal harshness, smoothness, and whether gestures felt connected to what I heard. Observations from playing became the basis for corrections I gave back to the agent.

This was different from repeatedly prompting the agent to “improve” the page. The grounding came from a specific external signal — what I could actually hear and feel when using the browser as an instrument.

[`3c7dea5`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-CongyuLiu09/commit/3c7dea5)

### 4. The first gesture needed to be part of the instrument

Web Audio begins with a suspended `AudioContext`, so the browser requires a user gesture before sound can begin. The obvious interface would have been a separate “Start Audio” button followed by instructions. I instead treated that restriction as part of the instrument design.

The first interaction activates the audio system and leads directly into playing. This matters especially for the crit because another person encounters the work before I explain it. The opening screen therefore needed to invite action rather than explain the implementation.

I verified this by reloading the page and testing it from a cold start rather than only continuing from an already-active development session. I checked that the first interaction led naturally toward sound, and I tested more than one input path so that the experience did not depend entirely on my normal mouse workflow.

[`3c7dea5`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-CongyuLiu09/commit/3c7dea5)

## Before you ship

Before submission I used the starter's checks to verify the fixed contract, including:

```bash
pnpm check:evidence
```

I also checked the built/deployed version rather than relying only on the local development server, and opened this file on GitHub to confirm that its evidence links resolve correctly.

The most important lesson from the prototype was that technical correctness and experiential correctness were different things. The starter harness could establish whether the implementation satisfied measurable requirements, but listening and play-testing were necessary to decide whether the result actually worked as an instrument. This made my own judgement part of the harness rather than something applied only after the agent had finished.