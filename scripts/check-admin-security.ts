import { promises as fs } from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(__dirname, "..");
const adminDir = path.join(projectRoot, "app", "admin");
const adminActionsPath = path.join(projectRoot, "app", "actions", "admin.ts");

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

function rel(filePath: string): string {
  return path.relative(projectRoot, filePath);
}

async function main() {
  const problems: string[] = [];

  const allAdminFiles = await walk(adminDir);
  const routeFiles = allAdminFiles.filter((filePath) => {
    const name = path.basename(filePath);
    return name === "page.tsx" || name === "layout.tsx";
  });

  for (const filePath of routeFiles) {
    const src = await fs.readFile(filePath, "utf8");
    const hasImport = src.includes("from \"@/lib/require-admin\"") || src.includes("from '@/lib/require-admin'");
    const hasCall = src.includes("await requireAdmin(");
    if (!hasImport || !hasCall) {
      problems.push(
        `${rel(filePath)} is missing explicit server-side admin guard (import + await requireAdmin()).`,
      );
    }
  }

  const adminActionsSource = await fs.readFile(adminActionsPath, "utf8");
  const hasRoleCheck =
    adminActionsSource.includes("async function getAdminSession()") &&
    adminActionsSource.includes('session.user.role !== "ADMIN"');
  if (!hasRoleCheck) {
    problems.push(
      `${rel(adminActionsPath)} is missing getAdminSession() admin role validation.`,
    );
  }

  if (problems.length > 0) {
    console.error("Admin security checks failed:\n");
    for (const problem of problems) {
      console.error(`- ${problem}`);
    }
    process.exit(1);
  }

  console.log(`Admin security checks passed (${routeFiles.length} admin route files verified).`);
}

main().catch((error) => {
  console.error("Admin security checks crashed:", error);
  process.exit(1);
});
