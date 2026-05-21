#!/usr/bin/env node

import { constants, copyFileSync, existsSync, statSync } from 'node:fs';
import { access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(scriptDir, '..');
const templateDir = resolve(skillRoot, 'templates');

const templates = {
  'lightweight-test-design': {
    file: 'lightweight-test-design.md',
    description: 'Lightweight test design before generating scripts',
  },
  'regression-impact-analysis': {
    file: 'regression-impact-analysis.md',
    description: 'Impact-based regression scope and evidence',
  },
  'bug-report': {
    file: 'bug-report.md',
    description: 'Defect report with failure classification and test reinforcement',
  },
  'qa-test-report': {
    file: 'qa-test-report.md',
    description: 'Final QA test report and runtime validation summary',
  },
};

function usage() {
  console.log(`Usage:
  node scripts/qa_artifacts.mjs list
  node scripts/qa_artifacts.mjs create <template-name> <output-path>

Available templates:`);
  listTemplates();
}

function listTemplates() {
  for (const [name, template] of Object.entries(templates)) {
    console.log(`  ${name.padEnd(28)} ${template.description}`);
  }
}

function fail(message, showUsage = false) {
  console.error(`Error: ${message}`);
  if (showUsage) {
    console.error('');
    usage();
  }
  process.exitCode = 1;
}

async function assertReadableFile(path, label) {
  if (!existsSync(path)) {
    throw new Error(`${label} does not exist: ${path}`);
  }
  if (!statSync(path).isFile()) {
    throw new Error(`${label} is not a file: ${path}`);
  }
  await access(path, constants.R_OK);
}

async function createArtifact(templateName, outputPathArg) {
  const template = templates[templateName];
  if (!template) {
    fail(`Unknown template "${templateName}".`, true);
    return;
  }

  if (!outputPathArg) {
    fail('Missing <output-path>.', true);
    return;
  }

  const templatePath = resolve(templateDir, template.file);
  const outputPath = resolve(process.cwd(), outputPathArg);
  const outputDir = dirname(outputPath);

  try {
    await assertReadableFile(templatePath, 'Template file');
  } catch (error) {
    fail(error.message);
    return;
  }

  if (!existsSync(outputDir) || !statSync(outputDir).isDirectory()) {
    fail(`Output directory does not exist: ${outputDir}`);
    return;
  }

  if (existsSync(outputPath)) {
    fail(`Output file already exists: ${outputPath}`);
    return;
  }

  copyFileSync(templatePath, outputPath);
  console.log(`Created ${templateName} artifact: ${outputPath}`);
  console.log('Fill this template using the current project Spec, code, tests, and execution evidence. This script does not decide QA scope, risk, coverage, or results.');
}

async function main() {
  const [command, templateName, outputPath] = process.argv.slice(2);

  if (command === 'list') {
    listTemplates();
    return;
  }

  if (command === 'create') {
    await createArtifact(templateName, outputPath);
    return;
  }

  fail(command ? `Unknown command "${command}".` : 'Missing command.', true);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
