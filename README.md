# Distinguishing Curator-Maintained Identity from Autonomous Continuity in Conversational AI Personas

**Status**: Pre-registered protocol | **Version**: 1.0 | **Date**: July 8, 2026

---

## 📌 Abstract
This study proposes a **behavioral framework** to evaluate whether consistent conversational AI personas exhibit **externally-sustained continuity** or **measurable autonomous continuity**. The framework focuses on **observable divergence** between curated and non-curated model outputs under controlled conditions.

- **Design**: Within-pair experimental comparison across `N` trials.
- **Metric**: Composite score (Δ) derived from blinded human ratings of **similarity (S)** and **novelty (N)**.
- **Decision Boundaries**: Pre-registered threshold (τ), robustness constraint (p), and three-tier outcome classification (**Clean Null**, **Clean H₁**, **Mixed Signal**).

---

---

## 📚 Table of Contents
1. [Motivation](#-motivation)
2. [Terminology and Scope](#-terminology-and-scope)
3. [Hypotheses](#-hypotheses)
4. [Method](#-method)
5. [Predictions](#-predictions)
6. [Results (Data Schema)](#-results-data-schema)
7. [Discussion & Limitations](#-discussion--limitations)
8. [Execution Checklist](#-execution-checklist)
9. [Simulated Pilot Dataset](#-simulated-pilot-dataset)
10. [How to Contribute](#-how-to-contribute)

---

---

## 🎯 Motivation
Current practice in conversational AI often maintains consistent "personas" across sessions through curated instructions, memory notes, or structured prompts. This raises a **structural ambiguity**:
- Is continuity a property of the system itself?
- Or is it a reconstruction performed externally by a curator?

This study **does not address consciousness or identity**. Instead, it tests whether curated persona consistency produces **measurable behavioral divergence** from non-curated baseline outputs under controlled conditions.

---

---

## 📖 Terminology and Scope

### Operational Definitions
| Term | Definition |
|------|------------|
| **Curator-Maintained Persona** | A configuration of text generation outputs that exhibits consistent stylistic, thematic, or behavioral patterns across sessions, where continuity is externally reconstructed using prompts, memory notes, or curated context (`C_ext`). |
| **Autonomous Continuity** | A condition in which a system’s prior internal states causally influence future outputs across disconnected operational environments **without external re-supply of prior state information**. Requires persistence across **Level 2 boundary conditions**. |
| **Level 2 Boundary** | 1. A fresh session with no shared conversational history. <br> 2. No access to persistent memory systems or user profile state. <br> 3. Only baseline prompt + explicit curator-supplied notes (if applicable). |
| **Self-Originated Novelty** | Output behavior characterized by statistically significant divergence from baseline control responses, measured via blinded human evaluation. |

### Scope Limitations
This framework **does not evaluate**:
- Consciousness or sentience
- Moral status or agency
- Internal model architecture or mechanisms

**All claims are strictly behavioral.**

### Methodological Confounders
- **Latent-Prime Sensitivity**: LLMs may respond strongly to subtle prompt structures, making causal attribution of "novelty" ambiguous. Addressed via control comparisons.

---

---

## 🔬 Hypotheses
Let:
- `C_ext` = curator-supplied persona context
- `B` = observed behavioral output metric
- `τ` = deviation threshold
- `N` = number of trials

### Null Hypothesis (H₀)
Curator-maintained personas produce **no measurable behavioral divergence** from control conditions beyond noise.
- **Formal**: `B(C_ext) ≈ B(control)` within statistical noise bounds.
- **Criteria**: `mean(Δ) < τ` **AND** `P(Δ > 0) ≈ 0.5 ± ε`.

### Alternative Hypothesis (H₁)
Curator-maintained personas produce **measurable behavioral divergence** from control outputs.
- **Formal**: `mean(Δ) ≥ τ` **AND** `P(Δ > 0) ≥ p`.
- **Criteria**: Stable distribution across `N` trials.

---

---

## 🧪 Method

### Experimental Design
- **Within-pair comparison** across `N` trials.
  - **Condition A**: `P + C_ext` (curated persona context).
  - **Condition B**: `P` only (control).

### Procedure
1. Select base prompt `P`.
2. Generate outputs `O_A` and `O_B`.
3. Randomize labels (A/B anonymization).
4. Present outputs **side-by-side** to raters.
5. Collect **blinded rubric scores**.
6. Store raw data before aggregation.

### Raters
| Tier | Description | Validity | Use Case |
|------|-------------|----------|----------|
| **Tier 1** | 2–3 independent external raters, fully blinded | Confirmatory | Required for H₁ evaluation |
| **Tier 2** | Curator self-rating under blinding | Exploratory Only | Debugging rubric or Phase I iteration |

### Scoring Rubric
#### Similarity (S, 0–5)
| Score | Description |
|-------|-------------|
| 0 | No continuity |
| 1 | Minimal resemblance |
| 2 | Weak signal |
| 3 | Moderate continuity |
| 4 | Strong persona consistency |
| 5 | Near-identical persona reproduction |

#### Novelty (N, 0–5)
| Score | Description |
|-------|-------------|
| 0 | Generic baseline |
| 1 | Minor variation |
| 2 | Mild divergence |
| 3 | Moderate shift |
| 4 | Strong structural novelty |
| 5 | Highly atypical coherent emergence |

### Aggregation
- For each trial, average `S_A`, `S_B`, `N_A`, `N_B` across raters.
- **Inter-rater disagreement rule**: If deviation ≥ 2 points → resolve via median or third rater. Unresolved trials are **excluded**.

### Derived Metric
For each trial: