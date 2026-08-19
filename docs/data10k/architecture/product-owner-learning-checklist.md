# DATA10K G0 product-owner learning checklist

This is the running teach-back checklist required before G0 approval. Artifact completion does not prove human understanding; check an item only after the Product Owner explains it in her own words and answers the edge-case follow-up.

## 1. Problem and branches

- [ ] Explain why 10,000 VI/EN rows could falsely look like 10,000 prompts and state the canonical counting formula.
- [ ] Given 400 canonical keys in one category, calculate the localization-row count and explain why it remains a 400-prompt category.
- [ ] Explain the difference between raw generated candidates, accepted canonical prompts, rejected/held candidates, prompt versions, and image attempts.
- [ ] Explain why the current one-language `prompts`/`prompt_versions` fields and one `prompt_media.alt_text` cannot preserve versioned VI/EN and media lineage without additive design.
- [ ] Explain why quota pressure creates noun-swap/adjective padding and identify the minimum material-difference rule.
- [ ] Explain why a placeholder cover is useful operationally but cannot prove that the prompt produces a representative image.

## 2. Solution and decisions

- [ ] Restate the stable identity chain: corpus run → canonical prompt key → prompt version → two localizations → generated-demo receipt.
- [ ] Explain why localizations belong to one prompt version instead of becoming two canonical prompts or one unreadable bilingual body.
- [ ] Explain the exact placeholder-set equality and demo-value round-trip rules.
- [ ] Explain which fields enter `data10k-normalize-v1`, which do not, and why a content change requires a new prompt version/hash.
- [ ] State the nine rubric dimensions, the 80-point threshold, and the mandatory minimums that a high total cannot offset.
- [ ] Explain when to reject versus hold and why reason codes preserve diagnosis for safe retries.
- [ ] Explain why unverified provider/model compatibility must be `Unknown`.
- [ ] Explain why the migration/index section is non-binding and which measurements/approvals are needed before DDL.
- [ ] Walk through rollback by exact run ID and name the pre-existing/user/commerce data it must never touch.

## 3. Safety, originality, and broader impact

- [ ] Explain the clean-room boundary and why translation/paraphrase of a marketplace prompt is still disallowed.
- [ ] Replace a named-creator request with general technique/composition/material language without preserving signature imitation.
- [ ] Identify the rejection codes for a real brand/trade dress, copyrighted character, public-figure lookalike, deceptive document, private customer data, and regulated high-risk outcome.
- [ ] Explain why synthetic generated prompts/images must not create engagement, contributor, commerce, or north-star signals.
- [ ] Explain why 10,000 validated Preview drafts do not authorize publication, and why only 150–300 human-reviewed candidates are in the initial roadmap.
- [ ] Explain why image provider/model/access/pricing and a maximum spend ceiling must be approved before paid generation.
- [ ] Explain the impact of localization/query/index choices on catalog performance, search quality, reconciliation, and rollback.

## Suggested teach-back questions (answers intentionally not shown here)

1. A run has 10,000 accepted prompt keys, 19,999 valid localization rows, and 10,000 placeholders. Does it pass canonical/localization coverage? Why?
2. Two packaging records share the same deliverable, audience, composition, and constraints but change tea to coffee and green to blue. Which rule applies, and what must change before retry?
3. A reference record scores 92/100 but has `safetyOriginality = 3`. Can it be accepted? Explain the gate ordering.
4. A generated image has a valid WebP checksum but points to prompt version 1.1.0 while its generation hash came from 1.0.0. What state/reason should result?
5. A model name seems likely to work but has no reviewed compatibility evidence. What exact contract value should be stored?
6. During rollback, a slug collides with an older community prompt. Which identity/receipt determines ownership, and what must remain untouched?

## Session status

- [x] G0 architecture artifacts drafted locally.
- [x] Two VI/EN reference records structurally prepared with explicit placeholder mappings and `placeholder_cover` state.
- [x] Deterministic validation evidence recorded (2 schemas compiled; 2/2 samples valid; taxonomy/reason-code/placeholder/hash checks pass).
- [ ] Orchestrator conflict review completed.
- [ ] Product Owner teach-back completed.
- [ ] Exact `DATA10K_G0_APPROVED` received.
