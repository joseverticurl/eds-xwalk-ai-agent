/**
 * Smoke demo for local development.
 *
 * Requires the server running:
 *   cd mcp-server && npm run dev
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const serverBase = process.env.SMOKE_BASE_URL ?? 'http://localhost:8787';
const workspaceRoot = path.resolve(process.cwd(), '..');

async function main() {
  const backendInputPath = path.join(workspaceRoot, 'playground', 'sample-inputs', 'generate-block-backend.hero.json');
  const htmlInputPath = path.join(workspaceRoot, 'playground', 'sample-inputs', 'validate-ue-html.hero.json');
  const feInputPath = path.join(workspaceRoot, 'playground', 'sample-inputs', 'generate-block-frontend.hero.json');

  const backendInput = JSON.parse(await fs.readFile(backendInputPath, 'utf8'));
  const htmlInput = JSON.parse(await fs.readFile(htmlInputPath, 'utf8'));
  const feInput = JSON.parse(await fs.readFile(feInputPath, 'utf8'));

  const generated = await postJson(`${serverBase}/generate/block/backend`, backendInput);
  console.log('\n[generate/block/backend] ok:', generated.ok);
  console.log(JSON.stringify(generated.artifact.json, null, 2));

  const validated = await postJson(`${serverBase}/validate/ue-html`, htmlInput);
  console.log('\n[validate/ue-html] ok:', validated.ok);
  console.log(JSON.stringify(validated, null, 2));

  const frontend = await postJson(`${serverBase}/generate/block/frontend`, feInput);
  console.log('\n[generate/block/frontend] ok:', frontend.ok);
  console.log(frontend.artifacts.map((a) => a.path).join('\n'));

  // MCP-style dispatcher demo (same call, via tool name)
  const mcpFrontend = await postJson(`${serverBase}/mcp/call`, {
    tool: 'generate.block.frontend',
    arguments: feInput
  });
  console.log('\n[mcp/call generate.block.frontend] ok:', mcpFrontend.ok);
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response (${res.status}): ${text}`);
  }
}

try {
  await main();
} catch (e) {
  console.error(e);
  process.exitCode = 1;
}

