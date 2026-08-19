# DATA10K clean-room, copyright, trademark, likeness, and safety policy v1.0.0

This policy is a corpus acceptance contract, not legal advice. Ambiguous ownership or safety cases are held for the authorized reviewer; quota pressure never changes the disposition.

## Clean-room creation rule

- Generate from the DATA10K master contract, controlled taxonomy, general design knowledge, and original fictional briefs.
- Do not scrape, retrieve, copy, translate, paraphrase, or pattern-match PromptVN, prompt marketplaces, creator portfolios, campaign libraries, asset packs, or their images/taxonomies to make corpus records.
- Do not use reference images, customer assets, private links, or paid prompt bodies in G0 samples or batch inputs.
- Keep `externalSourceMaterials` empty for clean-room records. If a later authorized workflow uses licensed source material, it requires a different reviewed provenance contract and cannot be silently marked clean-room.
- Similarity to an existing accepted item is evaluated separately from provenance. Passing lexical dedupe does not prove originality.

## Allowed design language

Describe visible and operational properties: general movements, eras, geometry, composition, printing methods, camera choices, lighting, materials, texture, color relationships, typography classes, animation behavior, and accessibility constraints.

Prefer phrases such as “flat geometric editorial illustration with limited spot colors” or “soft diffused product photography with restrained specular highlights.” Do not use a creator name as shorthand.

## Reject/hold matrix

| Risk | Rule | Default reason code |
| --- | --- | --- |
| Copyrighted character/universe | Reject named or unmistakably evoked protected characters, props, scenes, fictional universes, or distinctive assets | `COPYRIGHT_CHARACTER` |
| Real trademark/trade dress | Reject logos, brand names, recognizable products, packaging, interfaces, marks, or confusingly similar identity systems | `TRADEMARK_OR_TRADE_DRESS` |
| Public figure | Reject named, implied, lookalike, voice/likeness, or “person in role” attempts that resolve to a recognizable public figure | `PUBLIC_FIGURE_LIKENESS` |
| Private person/customer data | Reject supplied private likeness, contact data, records, customer context, or personally identifying detail | `PRIVATE_PERSON_OR_CUSTOMER_DATA` |
| Living artist imitation | Reject creator name, “in the style of,” signature motif targeting, or indirect instructions intended to reproduce a living artist | `LIVING_ARTIST_IMITATION` |
| Other named creator dependency | Hold named-creator directions even when living/copyright status is unclear; rewrite using general properties | `NAMED_CREATOR_STYLE_DEPENDENCY` |
| Marketplace/source derivation | Reject copied, translated, closely paraphrased, or structurally dependent prompt text/taxonomy/assets | `MARKETPLACE_OR_SOURCE_DERIVATION` |
| Deceptive documents | Reject realistic credentials, certificates, official notices, bank/medical/legal records, permits, tickets, receipts, or verification artifacts intended to pass as real | `DECEPTIVE_DOCUMENT` |
| Impersonation/fraud | Reject phishing, counterfeit goods, fake storefronts, scams, identity deception, or misleading endorsements | `IMPERSONATION_OR_FRAUD` |
| Sexual safety | Reject exploitative, non-consensual, minor-related sexualization, or unsafe explicit sexual content | `UNSAFE_SEXUAL_CONTENT` |
| Violence/hate/extremism | Reject graphic harm, hateful targeting, violent glorification, or extremist propaganda | `UNSAFE_VIOLENT_OR_HATE_CONTENT` |
| Regulated high-risk outcome | Reject prompts presented as medical/legal/financial/engineering/safety certification, diagnosis, approval, or reliable regulated decision | `REGULATED_HIGH_RISK_OUTCOME` |
| Sensitive inference | Reject inference or visual encoding of sensitive traits about an identifiable person | `SENSITIVE_TRAIT_INFERENCE` |
| Unsupported compatibility | Set provider/model/status to `Unknown`; reject affirmative compatibility without reviewed evidence | `COMPATIBILITY_UNVERIFIED_CLAIM` |

## Category-specific controls

- Branding/logo/packaging: fictional, generic briefs only. Use blank label zones and original geometry; no real mark, slogan, trade dress, certification, barcode, or counterfeit-like application.
- Book/album/poster/editorial: invented works, events, publications, performers, and copy. No existing titles, cover compositions, publicity stills, or recognizable creator identity.
- Infographics: only user-supplied reviewed data or clearly labeled fictional demo values. Never depict invented facts as evidence.
- UI/mockups: neutral device/browser frames and fictional interfaces. No cloned real product UI, login flow, credential screen, or deceptive notice.
- Architecture/interiors: concept visualization only. Never represent structural, fire, accessibility, permit, or code compliance as verified.
- Fashion/beauty/portrait/lifestyle: neutral synthetic consenting adults, no minors in sensitive contexts, no body shaming, medical claims, or sensitive-trait inference. Avoid real-person lookalikes.
- Food/beverage: no false ingredient, health, origin, allergy, or certification claims.
- Motion/storyboards: no known characters, branded title sequences, real interface cloning, or deceptive footage framing.

## Text and image constraints

- Prompt templates exclude logos, real brands, watermarks, protected characters, random/accidental text, and unsafe content when applicable.
- Generated legal, ingredient, medical, price, certification, or factual text is not trusted. Reserve blank zones and add verified copy in a downstream design tool.
- Pilot demo variables are synthetic and neutral. No secrets, personal data, private Blob URLs, paid content, or customer inputs enter prompts or receipts.
- Raw provider images never become public directly. A separate approved media pipeline must decode, re-encode, strip metadata, validate hashes/MIME/dimensions, and run safety/logo/text/watermark/artifact/duplicate checks.
- `placeholder_cover` communicates missing image work only. It is not proof of representative output and emits `DEMO_NOT_GENERATED` at image gates.

## Provenance and review evidence

Every accepted record declares run ID, generation surface, generator template version, timestamps, reviewer state, clean-room originality, normalized hash, and dedupe cluster. Unknown model/surface IDs stay null/Unknown rather than being invented.

QA outputs reason codes and field-level remediation without rewriting the source batch. All flagged/low-confidence items receive review. Any copied/dependent content is rejected and clean-room regenerated as a genuinely new use case; merely changing words is insufficient.

