# ALIPROMPT Marketplace — Owner Learning Checklist

This checklist is evidence-based. An item is checked only after the owner explains it in her own words or makes the required decision.

## S0 — Problem and boundaries

- [ ] Explain why comparable public functionality is allowed while copying PromptVN’s source, content, taxonomy, images, or pixel layout is not.
- [ ] Distinguish a visitor, member, contributor, editor, and admin, including the reason contributors may publish only free prompts.
- [ ] Explain why “ALIPROMPT is the only seller” changes the order, payment, and entitlement data model.
- [ ] Name the three systems of record: PostgreSQL, Blob, and the payment provider; explain what each must never decide alone.
- [ ] Describe a payment replay and why idempotency plus a verified server webhook prevents duplicate access.
- [ ] Explain why Preview can be tested without authorization to deploy Production, and why database rollback is more constrained than application rollback.

### Owner evidence

Record the owner’s own explanation and any product decision here before checking the related item.

## S1 — Foundation (pending)

- [ ] Explain why the existing Cloudflare/Vinext/D1 code cannot satisfy the required native Next.js/Vercel/PostgreSQL/Blob runtime as-is.
- [ ] Explain the auth boundary and the difference between authentication and authorization.
- [ ] Explain why `/api/health` stays independent from PostgreSQL while `/api/readiness` fails when PostgreSQL or environment isolation is unsafe.
- [ ] Explain how the three environment tags stop a Preview deployment from using Production database or Blob resources.

## S2–S4 — Public content and community (pending)

- [ ] Explain how search quality, privacy, and moderation interact.
- [ ] Explain the moderation state machine and why a Blob upload is not automatically public content.

## S5–S7 — Commerce and operations (pending)

- [ ] Explain which server-side fact creates entitlement and which client-side signals are untrusted.

## Product review decisions (pending)

- [ ] Explain why green build/test gates do not prove PostgreSQL, Blob, email, payment, or role boundaries work on Vercel Preview.
- [ ] Distinguish a schema, UI, or contract from an end-to-end feature using the AI-agent contract, local catalog preview, and HMAC payment adapter.
- [ ] Decide whether the existing workshop and Phase-3 waitlist should be integrated into the marketplace information architecture, and name the approved post-copy conversion action.
- [ ] Explain why only a verified server payment event can grant paid access, not a browser redirect, URL, or client state.
- [ ] State why the English route must label untranslated community content instead of silently machine-translating it.
- [ ] Explain the release gates, rollback sequence, and the production-approval boundary.
