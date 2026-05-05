export function collectComposeVariables(composeText) {
  const variables = new Set();
  const pattern = /(?<!\$)\$\{([A-Za-z_][A-Za-z0-9_]*)(?:(?::?[-+?=])[^}]*)?\}/g;

  for (const match of composeText.matchAll(pattern)) {
    variables.add(match[1]);
  }

  return variables;
}

export function parseEnvKeys(envText) {
  const keys = new Set();

  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;
    keys.add(trimmed.slice(0, separator));
  }

  return keys;
}

export function findMissingEnvKeys(composeText, envText) {
  const composeVariables = collectComposeVariables(composeText);
  const envKeys = parseEnvKeys(envText);
  return [...composeVariables].filter((key) => !envKeys.has(key)).sort();
}

export function findUnsafeOfflineEnvValues(envText) {
  const unsafe = [];
  const sensitiveKeyPattern = /(PASSWORD|SECRET|TOKEN|PRIVATE_KEY|API_KEY|DATABASE_URL)/;

  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;

    const key = trimmed.slice(0, separator);
    const value = trimmed.slice(separator + 1);
    if (!sensitiveKeyPattern.test(key)) continue;

    if (!value.includes("<set-inside-offline-environment>")) {
      unsafe.push(`${key} must use <set-inside-offline-environment> placeholder`);
    }
  }

  return unsafe;
}

export function findCloudRuntimeDependencies(packageFiles) {
  const findings = [];
  const cloudDependencyPatterns = [
    /^@aws-sdk\//,
    /^aws-sdk$/,
    /^aws-amplify$/,
    /^@aws-amplify\//,
    /^@azure\//,
    /^@google-cloud\//,
    /^firebase$/,
    /^firebase-admin$/,
    /^@firebase\//,
    /^@vercel\//,
    /^@neondatabase\//,
    /^supabase$/,
    /^@supabase\//,
    /^@cloudflare\//,
    /^@upstash\//,
    /^@planetscale\//
  ];
  const dependencySections = [
    ["dependencies", "dependency"],
    ["optionalDependencies", "optionalDependency"],
    ["peerDependencies", "peerDependency"],
    ["devDependencies", "devDependency"]
  ];

  for (const file of packageFiles) {
    for (const [section, label] of dependencySections) {
      for (const name of Object.keys(file.json[section] ?? {})) {
        if (cloudDependencyPatterns.some((pattern) => pattern.test(name))) {
          findings.push(`${file.path} ${label} ${name}`);
        }
      }
    }
  }

  return findings;
}
