#!/usr/bin/env node

import { constants, copyFileSync, existsSync, readFileSync, statSync } from 'node:fs';
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
  node scripts/qa_artifacts.mjs check <template-name> <artifact-path>

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

function readArtifact(pathArg) {
  if (!pathArg) {
    throw new Error('Missing <artifact-path>.');
  }

  const artifactPath = resolve(process.cwd(), pathArg);
  if (!existsSync(artifactPath)) {
    throw new Error(`Artifact file does not exist: ${artifactPath}`);
  }
  if (!statSync(artifactPath).isFile()) {
    throw new Error(`Artifact path is not a file: ${artifactPath}`);
  }

  return {
    path: artifactPath,
    content: readFileSync(artifactPath, 'utf8'),
  };
}

function getSection(content, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const startPattern = new RegExp(`^## ${escapedHeading}\\s*$`, 'm');
  const startMatch = content.match(startPattern);
  if (!startMatch || startMatch.index === undefined) {
    return null;
  }

  const sectionStart = startMatch.index + startMatch[0].length;
  const rest = content.slice(sectionStart);
  const nextMatch = rest.match(/^## /m);
  const sectionEnd = nextMatch && nextMatch.index !== undefined ? nextMatch.index : rest.length;
  return rest.slice(0, sectionEnd).trim();
}

function hasSection(content, heading) {
  return getSection(content, heading) !== null;
}

function tableRows(section) {
  if (!section) {
    return [];
  }

  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|'))
    .filter((line) => !/^\|\s*-+/.test(line))
    .slice(1);
}

function isPlaceholderCell(cell) {
  const value = cell.trim().replace(/`/g, '');
  if (!value) {
    return true;
  }

  const placeholderPatterns = [
    /^(yes|no|yes \/ no)$/i,
    /^(pass|fail|blocked|pass \/ fail \/ blocked)$/i,
    /^(covered|uncovered|covered \/ blocked \/ uncovered)$/i,
    /^(p0|p1|p2|p3|p0 \/ p1 \/ p2 \/ p3)$/i,
    /^unit \/ api\/integration \/ e2e$/i,
    /^red \/ green \/ pass \/ blocked$/i,
    /^command\/result\/report$/i,
    /^expected behavior gap, not setup failure$/i,
    /^path\/to\/test#name$/i,
    /^missing account \/ service \/ permission \/ env var \/ seed \/ browser \/ dependency$/i,
    /^existing tests \/ code \/ api contract \/ old spec$/i,
    /^active spec \/ prd \/ issue \/ user confirmation$/i,
    /^source or decision owner$/i,
    /^add \/ keep \/ modify \/ delete \/ blocked$/i,
    /^implement \/ keep \/ blocked$/i,
    /^extends \/ amends \/ supersedes \/ conflicts$/i,
    /^pure style \/ copy \/ low-risk display \/ one-time script \/ unrunnable ui or service$/i,
    /^review \/ snapshot \/ smoke \/ manual check \/ runtime validation$/i,
    /^code \/ test design \/ requirement change \/ data \/ environment \/ dependency \/ flaky \/ ambiguity$/i,
  ];

  return placeholderPatterns.some((pattern) => pattern.test(value));
}

function rowHasNonPlaceholderContent(row) {
  const cells = row
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());

  if (cells.some((cell) => !cell)) {
    return false;
  }

  return cells.some((cell) => !isPlaceholderCell(cell));
}

function rowContainsValue(row, valuePattern) {
  return row
    .split('|')
    .slice(1, -1)
    .some((cell) => valuePattern.test(cell.trim()));
}

function sectionHasNonPlaceholderTableRow(section) {
  return tableRows(section).some(rowHasNonPlaceholderContent);
}

function sectionHasIncompleteRowWithValue(section, valuePattern) {
  return tableRows(section).some((row) => rowContainsValue(row, valuePattern) && !rowHasNonPlaceholderContent(row));
}

function addFinding(findings, level, templateName, message) {
  findings.push({ level, templateName, message });
}

function requireSections(findings, templateName, content, headings) {
  for (const heading of headings) {
    if (!hasSection(content, heading)) {
      addFinding(findings, 'FAIL', templateName, `missing required section "${heading}"`);
    }
  }
}

function checkQaTestReport(content) {
  const templateName = 'qa-test-report';
  const findings = [];
  requireSections(findings, templateName, content, [
    'Conclusion',
    'Scope',
    'TDD Summary',
    'Tests Run',
    'Coverage Summary',
    'Regression Scope',
    'Remaining Risks',
    'Final Statement',
  ]);

  const testsRun = getSection(content, 'Tests Run');
  if (!sectionHasNonPlaceholderTableRow(testsRun)) {
    addFinding(findings, 'FAIL', templateName, 'Tests Run has no non-placeholder row');
  }

  const coverageSummary = getSection(content, 'Coverage Summary');
  if (!sectionHasNonPlaceholderTableRow(coverageSummary)) {
    addFinding(findings, 'FAIL', templateName, 'Coverage Summary has no non-placeholder row');
  }

  const tddSummary = getSection(content, 'TDD Summary');
  const nonTddExceptions = getSection(content, 'Non-TDD Exceptions');
  if (!sectionHasNonPlaceholderTableRow(tddSummary) && !sectionHasNonPlaceholderTableRow(nonTddExceptions)) {
    addFinding(findings, 'FAIL', templateName, 'TDD Summary has no non-placeholder row and no Non-TDD Exceptions are recorded');
  }

  if (/Overall result:\s*BLOCKED/i.test(content)) {
    const blockers = getSection(content, 'Tests Not Run / Blockers');
    if (!sectionHasNonPlaceholderTableRow(blockers)) {
      addFinding(findings, 'FAIL', templateName, 'Overall result is BLOCKED but Tests Not Run / Blockers has no non-placeholder row');
    }
  }

  if (/Overall result:\s*FAIL/i.test(content)) {
    const failureAnalysis = getSection(content, 'Failure Analysis');
    if (!sectionHasNonPlaceholderTableRow(failureAnalysis)) {
      addFinding(findings, 'FAIL', templateName, 'Overall result is FAIL but Failure Analysis has no non-placeholder row');
    }
  }

  const conflictReview = getSection(content, 'Requirement Authority / Conflict Review');
  if (sectionHasIncompleteRowWithValue(conflictReview, /^conflicts$/i)) {
    addFinding(findings, 'FAIL', templateName, 'Requirement Authority / Conflict Review has an incomplete conflicts row');
  }

  const runtimeValidation = getSection(content, 'Runtime QA Validation');
  if (runtimeValidation && !/does not count as Unit\/API\/E2E business coverage/i.test(runtimeValidation)) {
    addFinding(findings, 'WARN', templateName, 'Runtime QA Validation should state that it does not count as Unit/API/E2E business coverage');
  }

  return findings;
}

function checkLightweightTestDesign(content) {
  const templateName = 'lightweight-test-design';
  const findings = [];
  requireSections(findings, templateName, content, [
    'Context',
    'Input Sources Checked',
    'Requirement Authority / Conflict Gate',
    'Test Points',
    'TDD Candidates',
    'Coverage Closure',
  ]);

  const testPoints = getSection(content, 'Test Points');
  if (!sectionHasNonPlaceholderTableRow(testPoints)) {
    addFinding(findings, 'FAIL', templateName, 'Test Points has no non-placeholder row');
  }

  const conflictGate = getSection(content, 'Requirement Authority / Conflict Gate');
  const hasConflictRow = tableRows(conflictGate).some((row) => rowContainsValue(row, /^conflicts$/i));
  if (sectionHasIncompleteRowWithValue(conflictGate, /^conflicts$/i)) {
    addFinding(findings, 'FAIL', templateName, 'Requirement Authority / Conflict Gate has an incomplete conflicts row');
  }
  if (hasConflictRow && !/\bBLOCKED\b/.test(conflictGate || '')) {
    addFinding(findings, 'FAIL', templateName, 'Requirement Authority / Conflict Gate has a conflicts row without BLOCKED');
  }

  const coverageClosure = getSection(content, 'Coverage Closure') || '';
  if (/- \[[xX]\].*coverage artifact/i.test(coverageClosure)) {
    const hasCoverageArtifact = /\b[\w./-]+\.(test|spec|java|py|rs|go|cpp|c|cc|ts|tsx|js|jsx)(#[-\w .]+)?\b/.test(content);
    if (!hasCoverageArtifact) {
      addFinding(findings, 'FAIL', templateName, 'Coverage Closure marks coverage artifacts complete but no coverage artifact path was found');
    }
  }

  return findings;
}

function printFindings(findings, templateName) {
  for (const finding of findings) {
    console.log(`${finding.level} ${finding.templateName}: ${finding.message}`);
  }

  if (!findings.some((finding) => finding.level === 'FAIL')) {
    console.log(`PASS ${templateName}: structure check completed`);
  }
}

async function runCheck(templateName, artifactPathArg) {
  if (!['qa-test-report', 'lightweight-test-design'].includes(templateName)) {
    fail(`Check is not supported for template "${templateName}". Supported templates: qa-test-report, lightweight-test-design.`, true);
    return;
  }

  let artifact;
  try {
    artifact = readArtifact(artifactPathArg);
  } catch (error) {
    fail(error.message);
    return;
  }

  const findings = templateName === 'qa-test-report'
    ? checkQaTestReport(artifact.content)
    : checkLightweightTestDesign(artifact.content);

  printFindings(findings, templateName);

  if (findings.some((finding) => finding.level === 'FAIL')) {
    process.exitCode = 1;
  }
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

  if (command === 'check') {
    await runCheck(templateName, outputPath);
    return;
  }

  fail(command ? `Unknown command "${command}".` : 'Missing command.', true);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
