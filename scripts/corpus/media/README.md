# DATA10K local media contracts (G0)

These modules do not select or call an image provider, write Blob storage, or write a database. An approved runtime must supply a provider adapter, a hardened decoder/re-encoder, and visual-QA services.

`placeholder_cover` is explicitly rejected as a gate-satisfying `generated_demo`. Raw output is magic-checked, decoded, re-encoded with metadata stripping, decoded again, size/dimension/sha-256 checked, then passed to visual QA and perceptual hashing. Only that derivative can later be considered for Preview upload.

Preview keys are content-addressed from run, prompt, version, and sanitized hash. A failed upload or DB-link operation produces an orphan-cleanup receipt; a later approved worker must persist and execute the receipt. Formula helpers require measured pilot storage data and provider-approved estimates, rather than embedding prices.
