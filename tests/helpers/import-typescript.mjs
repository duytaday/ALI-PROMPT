import { readFile } from "node:fs/promises";
import ts from "typescript";

export async function importTypeScript(relativeUrl) {
  const source = await readFile(relativeUrl, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const encoded = Buffer.from(outputText).toString("base64");
  return import(`data:text/javascript;base64,${encoded}#${crypto.randomUUID()}`);
}
