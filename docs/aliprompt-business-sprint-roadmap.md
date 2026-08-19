# ALIPROMPT — Business Direction & S0–S7 Product Roadmap

`status: proposed_for_owner_review`  
`date: 2026-08-19`  
`planning_assumption: 2-week sprint, 4–5 FTE, maximum 85% planned capacity`

## 1. Strategic choice

ALIPROMPT should not position itself as another large prompt directory. The proposed category is:

> **Vietnamese-first Prompt Knowledge Network — find a real AI task, compare evidenced solutions, and reuse the exact prompt version that worked.**

The core knowledge unit is:

`Question/problem → Prompt Answer → immutable Prompt Version → Output Evidence → independent Attempt → vote/accepted answer`

This creates a defensible advantage around Vietnamese context, evidence, version history, trusted contributors, moderation, and outcome data. A raw prompt file is easy to copy; a growing problem–solution–evidence graph is harder to reproduce.

## 2. Market position

Current competitors validate demand but also expose the gap:

- PromptBase presents a marketplace with more than 310,000 tested prompts, creator selling, generation tools, and expert hiring: <https://promptbase.com/>.
- FlowGPT combines prompt/character discovery with categories, leaderboards, bounties, membership, and a wallet: <https://flowgpt.com/>.
- AIPRM emphasizes a large community-reviewed prompt library plus private/team prompt management: <https://www.aiprm.com/>.
- Stack Overflow shows why votes, accepted answers, reputation thresholds, and community moderation can make problem–solution content discoverable and governable: <https://stackoverflow.com/help/reputation>.

ALIPROMPT should therefore avoid competing on prompt count. It should compete on four promises:

1. **Problem-first discovery:** users search for a business task, not a clever prompt title.
2. **Evidence-first trust:** a publishable answer includes output evidence and model/version context.
3. **Reproducibility:** an Attempt always points to an immutable Prompt Version.
4. **Vietnamese usefulness:** taxonomy, examples, moderation, and use cases reflect Vietnamese users and businesses; Vietnamese/English content remains searchable.

## 3. Beachhead market

Launch with three verticals rather than opening every category:

1. **Marketing & content operations:** social posts, ads, SEO/AEO, video scripts, content repurposing, brand voice.
2. **E-commerce & product visuals:** product descriptions, product photography, campaign images, short video, customer support.
3. **Business productivity & automation:** research, reporting, sales, customer service, spreadsheets, and repeatable agent workflows.

Why these first:

- Output can be inspected quickly, so evidence and rating are meaningful.
- Users have repeated jobs and measurable time/value gains.
- The 2026 HubSpot report lists AI personalization, automation, search adaptation, and cross-channel repurposing among leading marketing trends: <https://blog.hubspot.com/marketing/hubspot-blog-marketing-industry-trends-report>.
- Shopify highlights content generation, personalization, multimodal AI, and purpose-built agents as current business use cases: <https://www.shopify.com/blog/ai-trends>.
- Canva's 2026 trend research says AI remains central to creator workflows while authentic human direction differentiates the result: <https://www.canva.com/newsroom/news/design-trends-2026/>.

Education, coding, legal, medical, finance, entertainment, and other niches remain backlog until one of the first three verticals proves repeat usage and manageable moderation.

## 4. Business model

### Phase A — Community liquidity

- Free questions, answers, prompt versions, evidence, attempts, votes, bookmarks, and accepted answers.
- Community contributors cannot set a price, receive payout, or self-publish without moderation.
- ALIPROMPT seeds high-quality examples and recruits domain contributors.

### Phase B — ALIPROMPT-owned commerce

- ALIPROMPT sells curated prompt packs, tested workflows, templates, workshops, and implementation services.
- A paid product must add convenience, curation, support, or a complete workflow; it should not merely paywall community content.
- Entitlement is attached to the buyer's library and verified by payment evidence.

### Phase C — Team subscription

- Private team collections, shared versions, approval workflows, organization taxonomy, usage analytics, and onboarding.
- Candidate pricing metric: active team seats plus workspace tier. Validate willingness to pay before building advanced enterprise controls.

### Explicit non-goals for V1

- No third-party seller marketplace, contributor payout, commission, KYC, or tax allocation.
- No monetary bounty.
- No automatic high-risk moderation privilege based only on reputation.
- No production migration, payment activation, DNS, or production deployment without a separate approval gate.

## 5. Product metrics

### North-star metric

**Weekly Verified Successful Attempts (WVSA):** successful Attempts by an eligible independent user against a specific Prompt Version, accepted by moderation and excluding the author/self-test/known abuse cluster.

The owner must still approve the target, cohort, measurement window, and minimum eligible sample in S0. A target must not be invented from synthetic data.

### Funnel metrics

- Discovery: search-to-question-open rate; zero-result and reformulation rate.
- Activation: percentage of new verified users completing a first valid Attempt within 7 days.
- Supply: percentage of valid Questions receiving an evidenced Answer in 24/72 hours.
- Trust: percentage of published Answers with approved evidence; accepted-answer rate; independent success rate by Prompt Version.
- Retention: 4-week returning searchers, testers, and contributors by cohort.
- Revenue: paid-pack view-to-purchase, entitlement activation, refund rate, and team trial-to-paid conversion.
- Guardrails: spam/abuse rate, self-vote rejection, PII/private artifact exposure, moderation SLA breach, P0/P1 defects, and upload rejection reasons.

Views, prompt count, likes, and synthetic test records are diagnostic only; they are not quality truth or north-star success.

## 6. Go-to-market sequence

1. Seed **150–300 human-reviewed** prompt solutions across the three beachhead verticals; keep the 1,000 generated prompts in test/staging only.
2. Recruit 20–30 founding contributors with domain credibility; give profile attribution and verified contributor status, not sales authority.
3. Publish problem-first, crawlable Question pages and Vietnamese case studies for SEO/AEO.
4. Run weekly “solve this task” challenges; reward with reputation, badges, visibility, or ALIPROMPT benefits.
5. Interview at least five activated users every sprint and review search-zero-result demand weekly.
6. Introduce paid ALIPROMPT packs only after community users show repeat Attempts and identifiable high-value workflows.

## 7. Sprint roadmap

No sprint should plan more than 85% of available capacity. Keep 15% for defects, review findings, support, and unknowns. If the team has fewer than four delivery FTE, split S4 and S5 rather than cutting their trust/safety scope.

| Sprint | Business outcome | Committed product slice | Exit evidence / decision gate |
|---|---|---|---|
| **S0 — Recovery & business contract** (1 week) | Remove decision ambiguity before engineering spend | Resolve OD-S0-01…07; lock beachhead, WVSA contract, upload limits, self-answer rule, reputation policy, moderation SLA, initial taxonomy, retention/appeal; establish Git/PR and isolated Preview ownership | Independent reviewer issues exact `S0_ACCEPTED`; otherwise S1 remains blocked |
| **S1 — Platform foundation** (2 weeks) | A safe Preview environment can host experiments without touching Production | Native Next.js/Vercel foundation; isolated Supabase Postgres; Drizzle migration authority; environment separation; health/readiness; reversible legacy migration scaffolding; baseline analytics schema | `S1_ACCEPTED`; Preview URL and commands tied to exact revision; rollback demonstrated |
| **S2 — Identity & contributor workspace** (2 weeks) | Verified users can join and prepare contributions safely | Authentication; public profile without email/PII; RBAC; drafts/status workspace; audit trail; rate limiting; admin/manual roles | Ten invited users complete sign-up and draft journey; unauthorized branches pass; `S2_ACCEPTED` |
| **S3 — Problem-first discovery** (2 weeks) | A user can find or ask a well-formed, non-duplicate problem | Canonical Question pages; old prompt compatibility/redirects; three verticals; controlled task/model/output tags; Vietnamese/English lexical search; duplicate suggestions; crawlable SEO/AEO pages | Search and ask E2E passes; zero-result/reformulation events visible; `S3_ACCEPTED` |
| **S4 — Answers, versions & evidence** (2 weeks) | Contributors can publish reproducible solutions with safe evidence | Prompt Answers; immutable Prompt Versions; image/file quarantine, validation, sanitization, approved derivative; moderation queues; self-share as self-answered Question | Successful, rejected, unauthorized, malicious-file, rollback, and audit branches pass; `S4_ACCEPTED` |
| **S5 — Trust & community loop** (2 weeks) | Independent users can signal whether a solution is useful and actually works | Version-bound Attempt; success/failure evidence; vote, bookmark, accepted answer; append-only reputation ledger; reports; leaderboard without PII; quality/WVSA ranking | Self-vote/self-attempt abuse excluded; concurrency/idempotency tests pass; beta cohort demonstrates the full loop; `S5_ACCEPTED` |
| **S6 — ALIPROMPT commerce** (2 weeks) | The company can validate willingness to pay without opening a multi-vendor marketplace | ALIPROMPT-owned packs; sandbox checkout; signed/idempotent webhook; entitlement/library; refund/revoke path; conversion analytics; community/paid-content boundary | Sandbox purchase-to-entitlement and failure/replay/refund tests pass; no real money or contributor selling; `S6_ACCEPTED` |
| **S7 — Beta hardening & release gate** (2 weeks) | A measured private/public beta candidate is safe, reversible, and supportable | Multi-user E2E; accessibility/mobile; performance/SEO; security and privacy review; backfill rehearsal/reconciliation; backup/restore/rollback; runbooks; stakeholder acceptance | Independent QA verdict and release packet; Production remains `ready, approvals pending` until explicit approval |

Expected elapsed time is about **15 weeks** under the stated capacity assumption. This is not a promise of calendar delivery until team members and effective capacity are confirmed.

## 8. Release slices

- **Internal Alpha after S4:** staff and founding contributors can create complete evidence-backed content.
- **Community Beta after S5:** invited users can search, ask, answer, test, vote, and accept.
- **Revenue Beta after S6:** selected users can buy ALIPROMPT-owned products in a controlled environment.
- **Production candidate after S7:** release packet is ready; actual Production actions still require explicit approval.

## 9. Stop/go rules

- Do not start S1 until exact `S0_ACCEPTED` exists. The current repository evidence shows S0 remains partial and the seven owner decisions are missing.
- Do not scale acquisition while evidence-backed Answer supply is too low to satisfy new Questions.
- Do not open additional verticals until one beachhead cohort shows repeat successful Attempts.
- Do not let generated fixtures vote, rank, earn reputation, appear as real members, or count toward WVSA.
- Do not launch commerce until entitlement, webhook idempotency, refund/revoke, and paid-content leakage tests pass.
- Do not launch Production with an open P0/P1 defect or an unrehearsed rollback.

## 10. Immediate owner decisions

Before S0 can close, the owner must approve at minimum:

1. The three proposed beachhead verticals.
2. WVSA target, time window, cohort start, and minimum eligible sample.
3. Upload limits and supported image/file types.
4. Self-answer acceptance/waiting rule.
5. Reputation events, caps, reversals, and manual privileges.
6. Moderation coverage, SLA, escalation, and stop threshold.
7. Initial tag manifest, retention/deletion, and appeal policy.

