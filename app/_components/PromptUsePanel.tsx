"use client";

import { useMemo, useState } from "react";
import { getMessages, type Locale } from "../../lib/i18n";

const variablePattern = /\{\{\s*([\p{L}\p{N}_ -]{1,48})\s*\}\}/gu;

function variablesIn(text: string) {
  return [...new Set([...text.matchAll(variablePattern)].map((match) => match[1].trim()).filter(Boolean))];
}

type StoredVariable = { key?: unknown; required?: unknown; optional?: unknown; default?: unknown; example?: unknown; validation?: { minLength?: unknown; maxLength?: unknown; allowedValues?: unknown } };

function safeDefinitions(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const definition = item as StoredVariable;
    const key = typeof definition.key === "string" && /^[\p{L}\p{N}_ -]{1,48}$/u.test(definition.key) ? definition.key.trim() : "";
    if (!key) return [];
    return [{ key, required: definition.required !== false && definition.optional !== true, defaultValue: typeof definition.default === "string" ? definition.default.slice(0, 500) : "", example: typeof definition.example === "string" ? definition.example.slice(0, 160) : "", minLength: typeof definition.validation?.minLength === "number" ? Math.max(0, Math.min(500, definition.validation.minLength)) : 0, maxLength: typeof definition.validation?.maxLength === "number" ? Math.max(1, Math.min(500, definition.validation.maxLength)) : 500 }];
  });
}

export default function PromptUsePanel({ prompt, promptId, trackingEnabled, locale = "vi", version, variableDefinitions, usageMetadata, outputSchema, lastTestedAt }: { prompt: string; promptId: string; trackingEnabled: boolean; locale?: Locale; version: string; variableDefinitions: unknown; usageMetadata: unknown; outputSchema: unknown; lastTestedAt: string | null }) {
  const variables = useMemo(() => variablesIn(prompt), [prompt]);
  const definitions = useMemo(() => safeDefinitions(variableDefinitions), [variableDefinitions]);
  const storedVariables = definitions.length ? definitions.map((definition) => definition.key) : variables;
  const defaults = Object.fromEntries(definitions.map((definition) => [definition.key, definition.defaultValue]));
  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [format, setFormat] = useState<"plain" | "markdown" | "json">("plain");
  const generated = prompt.replace(variablePattern, (_whole, name: string) => values[name.trim()]?.trim() || defaults[name.trim()] || `{{${name.trim()}}}`);
  const missing = storedVariables.filter((name) => { const definition = definitions.find((item) => item.key === name); return definition?.required && !(values[name]?.trim() || defaults[name]); });
  const copy = getMessages(locale).catalog;
  async function copyPrompt() {
    if (missing.length) { setMessage(copy.variablesRequired); return; }
    const copyText = format === "markdown" ? `\`\`\`text\n${generated}\n\`\`\`` : format === "json" ? JSON.stringify({ prompt: generated, outputSchema }, null, 2) : generated;
    try {
      await navigator.clipboard.writeText(copyText);
      setMessage(copy.copiedToClipboard);
      if (trackingEnabled) {
        void fetch("/api/library/usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promptId, promptVersion: version, copyFormat: format, idempotencyKey: crypto.randomUUID() }),
        });
      }
    }
    catch { setMessage(copy.copyError); }
  }
  const hasJsonSchema = Boolean(outputSchema && typeof outputSchema === "object" && (outputSchema as { type?: unknown }).type === "object");
  const metadata = usageMetadata && typeof usageMetadata === "object" ? usageMetadata as Record<string, unknown> : {};
  return <section className="prompt-use-panel" aria-labelledby="prompt-use-title"><div className="prompt-use-heading"><div><h2 id="prompt-use-title">{copy.usePromptTitle}</h2><span>{copy.estimatedTokens}: ~{Math.max(1, Math.ceil(generated.length / 4))} · v{version}</span></div>{storedVariables.length ? <button type="button" onClick={() => { setValues({}); setMessage(""); }}>{copy.reset}</button> : null}</div>
    {Object.keys(metadata).length || lastTestedAt ? <dl className="prompt-usage-metadata">{Object.entries(metadata).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{Array.isArray(value) ? value.join(", ") : typeof value === "string" || typeof value === "number" ? value : ""}</dd></div>)}{lastTestedAt ? <div><dt>Last tested</dt><dd>{new Date(lastTestedAt).toLocaleDateString(locale)}</dd></div> : null}</dl> : null}
    {storedVariables.length ? <div className="prompt-variable-form">{storedVariables.map((name) => { const definition = definitions.find((item) => item.key === name); return <label key={name}><span>{copy.valueFor} <strong>{name}</strong></span><input required={definition?.required} minLength={definition?.minLength} maxLength={definition?.maxLength ?? 500} value={values[name] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value.slice(0, 500) }))} placeholder={definition?.example || definition?.defaultValue || name} /></label>; })}</div> : null}
    <div className="prompt-preview"><span>{copy.preview}</span><pre>{generated}</pre></div>
    <div className="prompt-use-actions"><select aria-label="Copy format" value={format} onChange={(event) => setFormat(event.target.value as "plain" | "markdown" | "json")}><option value="plain">Plain text</option><option value="markdown">Markdown</option>{hasJsonSchema ? <option value="json">JSON</option> : null}</select><button className="prompt-copy" type="button" onClick={copyPrompt}>{copy.copyPrompt}</button><p className="prompt-copy-feedback" role="status" aria-live="polite">{message}</p></div>
  </section>;
}
