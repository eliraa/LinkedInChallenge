import fs from "fs";
import path from "path";

// Step 1: Normalize a raw env value from the file.
// If value is quoted, remove wrapping quotes; otherwise return trimmed value.
function parseEnvValue(rawValue: string): string {
  const trimmed = rawValue.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

// Step 2: Load key=value pairs from .env into process.env.
export function loadEnvFile(filePath = path.resolve(__dirname, ".env")): void {
  // Step 2.1: Exit early when .env file does not exist.
  if (!fs.existsSync(filePath)) {
    return;
  }

  // Step 2.2: Read and split file into lines.
  const fileContent = fs.readFileSync(filePath, "utf8");
  const lines = fileContent.split(/\r?\n/);

  // Step 2.3: Parse each non-empty, non-comment line.
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    // Step 2.4: Find '=' separator and skip invalid lines.
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex < 1) {
      continue;
    }

    // Step 2.5: Extract key/value and normalize the value.
    const key = trimmed.slice(0, equalsIndex).trim();
    const value = parseEnvValue(trimmed.slice(equalsIndex + 1));

    // Step 2.6: Keep existing process env values; only set missing keys.
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
