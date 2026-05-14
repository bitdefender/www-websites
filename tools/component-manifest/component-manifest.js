#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const blocksRoot = path.join(repoRoot, '_src', 'blocks');
const schemasDir = path.join(repoRoot, 'schemas');
const aggregateManifestPath = path.join(schemasDir, 'component-manifest.json');
const perBlockManifestName = 'manifest.json';

const AGGREGATE_META = {
  manifestVersion: '0.1.0',
  repoRoot,
  scope: 'Docs-backed public block contract for AI-driven EDS page generation. Prefer sidekick-documented authoring patterns and examples where available.'
};

function listBlockDirs() {
  return fs.readdirSync(blocksRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function perBlockManifestPath(identifier) {
  return path.join(blocksRoot, identifier, perBlockManifestName);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n');
}

function ensureBlockManifestShape(identifier, data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`Invalid manifest at ${perBlockManifestPath(identifier)}: expected an object`);
  }
  if (!data.identifier) {
    throw new Error(`Invalid manifest at ${perBlockManifestPath(identifier)}: missing identifier`);
  }
  if (data.identifier !== identifier) {
    throw new Error(`Invalid manifest at ${perBlockManifestPath(identifier)}: identifier mismatch (expected ${identifier}, received ${data.identifier})`);
  }
}

function buildAggregate() {
  const components = [];
  for (const identifier of listBlockDirs()) {
    const filePath = perBlockManifestPath(identifier);
    if (!fs.existsSync(filePath)) {
      continue;
    }
    const data = readJson(filePath);
    ensureBlockManifestShape(identifier, data);
    components.push(data);
  }

  components.sort((a, b) => a.identifier.localeCompare(b.identifier));

  const aggregate = {
    ...AGGREGATE_META,
    generatedAt: new Date().toISOString().slice(0, 10),
    components,
  };

  writeJson(aggregateManifestPath, aggregate);
  console.log(`Built aggregate manifest with ${components.length} component entries: ${aggregateManifestPath}`);
}

function splitFromAggregate() {
  const aggregate = readJson(aggregateManifestPath);
  const components = aggregate.components || [];
  let written = 0;

  for (const component of components) {
    const identifier = component.identifier;
    if (!identifier) {
      throw new Error('Aggregate manifest contains a component without identifier');
    }

    const blockDir = path.join(blocksRoot, identifier);
    if (!fs.existsSync(blockDir) || !fs.statSync(blockDir).isDirectory()) {
      console.warn(`Skipping ${identifier}: block directory not found at ${blockDir}`);
      continue;
    }

    const outPath = perBlockManifestPath(identifier);
    writeJson(outPath, component);
    written += 1;
  }

  console.log(`Wrote ${written} per-block manifests under ${blocksRoot}`);
}

const command = process.argv[2] || 'build';

if (command === 'build') {
  buildAggregate();
} else if (command === 'split') {
  splitFromAggregate();
} else {
  console.error('Usage: node tools/component-manifest.mjs [build|split]');
  process.exit(1);
}
