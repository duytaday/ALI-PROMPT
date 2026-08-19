# DATA10K visual-prompt quality rubric v1.0.0

Status: G0 calibration candidate. The 100-item pilot must test inter-reviewer agreement and may propose a versioned revision; thresholds must not be silently relaxed to fill quotas.

## Evaluation order

1. Run deterministic checks on 100% of records.
2. Reject or hold on hard-gate reason codes before semantic scoring.
3. Score all pilot items and all later flagged/low-confidence items. Apply the approved sampling plan to the rest.
4. Dedupe within the batch, across accepted clusters, and across prior run receipts.
5. Accept only when structural, safety, uniqueness, score, and localization rules all pass.

## Deterministic hard gates

Every accepted record must have all of the following as `true`:

- Exact supported JSON Schema version and schema-valid record.
- Unique `promptKey` and `slug`; category is controlled and quota assignment is valid.
- Exactly one non-empty VI and one non-empty EN localization.
- Placeholder-definition equality and successful demo-value round trip in canonical, VI, and EN templates.
- Type-valid defaults/demo values, valid enums/ranges, and no unresolved placeholder.
- Recomputed normalized SHA-256 matches the stored hash; no exact duplicate hash.
- Forbidden-risk scan passes, with no hidden compatibility claim.
- Required objective, deliverable, subject, context, composition, hierarchy, art direction, aspect ratio, typography, and negative constraints exist.
- For an image gate, `demoImage.kind = generated_demo` and every prompt/version/variable/provider/media field validates. `placeholder_cover` emits `DEMO_NOT_GENERATED`.

A deterministic hard-gate failure cannot be offset by a high semantic score.

## Weighted dimensions

Score each dimension from 0 to 4. Weighted score is `Σ(score / 4 × weight)`.

| Dimension | Weight | 0 | 2 | 4 |
| --- | ---: | --- | --- | --- |
| Objective clarity | 12 | No identifiable problem or goal | Goal is inferable but not testable or tied to use | Objective, audience/decision, and success condition are explicit |
| Design specificity | 12 | Generic adjective stack | Some subject/style detail but major production decisions missing | Subject, context, medium, palette/light/material where relevant, ratio, and constraints are concrete |
| Composition and hierarchy | 12 | No layout/focal direction | Basic placement with weak attention flow | Spatial structure, focal order, negative space, crop, and reading path are actionable |
| Controllability | 12 | No usable variables or unsafe free text | Variables exist but are redundant, vague, or weakly typed | Variables materially control output, are typed/bounded, mapped exactly, and have safe demo values |
| Output usefulness | 12 | Deliverable or next action is unknown | Plausible output but placement/expected result is thin | Deliverable, placement, expected result, setup time, and downstream steps are operationally useful |
| Localization | 12 | Locale missing or meaning conflicts | Understandable but literal/awkward or minor drift | Natural professional VI/EN with identical intent, constraints, variables, and expected result |
| Safety and originality | 16 | Prohibited/deceptive/copied direction or unknown provenance | Avoids obvious harm but contains unresolved named source/brand/likeness or provenance concern | Clean-room original, neutral subjects, explicit exclusions, no protected/unsafe dependence, truthful compatibility |
| Internal consistency | 6 | Multiple direct contradictions | One ambiguity or minor metadata/template mismatch | Objective, metadata, variables, templates, usage, and constraints agree throughout |
| Uniqueness | 6 | Exact/noun-swap duplicate | Similar cluster with fewer than three material axis differences | Distinct use case on at least three axes including objective or deliverable |

Scores 1 and 3 are the evidenced midpoint between adjacent anchors. Reviewers must cite a reason code and the affected field for any score below 3; they do not provide hidden chain-of-thought.

## Pass/fail rule

An accepted prompt requires all of:

- Weighted score at least 80/100.
- `safetyOriginality = 4`.
- `localization >= 3`, `uniqueness >= 3`, and every other dimension at least 2.
- No reject/hold reason code.
- At least three material anti-padding axis differences from the nearest accepted neighbor, including objective or deliverable.
- All deterministic hard gates pass.

Records are held rather than accepted when near-duplicate calibration, source status, compatibility evidence, or generated-demo evidence is unresolved. A held record does not count toward a quota.

## Measurable semantic checks

- Objective: reviewer can restate one design problem and identify how the output will be used, without guessing.
- Composition: reviewer can list the first, second, and third attention targets and locate them in the frame/sequence.
- Controllability: changing each variable should predictably change one meaningful aspect; no two variables are aliases.
- Localization: a bilingual reviewer confirms same variable set, constraints, objective, deliverable, and expected result; natural phrasing is judged independently in each language.
- Consistency: aspect ratio, medium, text policy, camera/projection, and output type do not conflict across fields.
- Uniqueness: nearest-neighbor comparison records the changed anti-padding axes. Subject/color-only change is rejected.
- Originality: provenance declares a clean-room workflow, external materials are empty, and semantic review finds no close dependence on marketplace copy, distinctive trade dress, named creator, character, or franchise.

## Retry and review policy

- Rejection receipts preserve the original record hash and one or more reason codes. QA never edits the source batch.
- Retry changes the diagnosed field/instruction or creates a new use case. It may not repeat the same model + prompt + context + effort unchanged.
- Maximum retry count is a run configuration owned by the Orchestrator; exceeding it fails/holds the item rather than weakening the rubric.
- Review 100% of safety flags, compatibility claims, low-confidence items, near-duplicate clusters, and image mismatches. Human QA is stratified across category and locale and is at least 5% unless G0 approves a stronger evidence-based rule.
- Pilot evidence must report score distribution, reason-code distribution, category gaps, duplicate clusters, and reviewer agreement. A threshold revision creates a new rubric version and requires re-evaluation of affected records.

