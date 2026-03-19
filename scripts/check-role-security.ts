import { promises as fs } from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(__dirname, "..");
const authPath = path.join(projectRoot, "lib", "auth.ts");
const adminActionsPath = path.join(projectRoot, "app", "actions", "admin.ts");

const actionRoots = [
  path.join(projectRoot, "app", "actions"),
  path.join(projectRoot, "lib", "actions"),
  path.join(projectRoot, "app", "api"),
];

function rel(filePath: string): string {
  return path.relative(projectRoot, filePath);
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      return [fullPath];
    }),
  );

  return nested.flat();
}

async function collectRuntimeFiles(): Promise<string[]> {
  const files: string[] = [];

  for (const root of actionRoots) {
    if (!(await exists(root))) {
      continue;
    }

    const discovered = await walk(root);
    files.push(
      ...discovered.filter((filePath) => filePath.endsWith(".ts") || filePath.endsWith(".tsx")),
    );
  }

  return files;
}

async function main() {
  const problems: string[] = [];

  const authSource = await fs.readFile(authPath, "utf8");
  const hasRoleFieldLocked = /role\s*:\s*\{[^}]*type\s*:\s*"string"[^}]*input\s*:\s*false[^}]*\}/.test(authSource);
  if (!hasRoleFieldLocked) {
    problems.push(
      `${rel(authPath)} must define role as non-client-writable (expected: role: { type: "string", input: false }).`,
    );
  }

  const adminActionsSource = await fs.readFile(adminActionsPath, "utf8");
  const hasAdminRoleGate =
    adminActionsSource.includes("async function getAdminSession()") &&
    adminActionsSource.includes('session.user.role !== "ADMIN"');
  if (!hasAdminRoleGate) {
    problems.push(
      `${rel(adminActionsPath)} is missing an ADMIN role gate in getAdminSession().`,
    );
  }

  const runtimeFiles = await collectRuntimeFiles();
  const allowlistedRoleWriters = new Set([adminActionsPath]);

  for (const filePath of runtimeFiles) {
    const source = await fs.readFile(filePath, "utf8");
    const mentionsRoleWrite =
      source.includes("prisma.user.update") ||
      source.includes("prisma.user.updateMany") ||
      source.includes("prisma.user.upsert") ||
      source.includes("prisma.user.create");

    if (!mentionsRoleWrite) {
      continue;
    }

    const writesRole = /role\s*:/.test(source);
    if (writesRole && !allowlistedRoleWriters.has(filePath)) {
      problems.push(
        `${rel(filePath)} appears to write user.role outside app/actions/admin.ts. Restrict role writes to admin-only actions.`,
      );
    }
  }

  if (problems.length > 0) {
    console.error("Role security checks failed:\n");
    for (const problem of problems) {
      console.error(`- ${problem}`);
    }
    process.exit(1);
  }

  console.log("Role security checks passed.");
}

main().catch((error) => {
  console.error("Role security checks crashed:", error);
  process.exit(1);
});
