export function parseChecksumEntries(text) {
  const entries = new Map();
  const linePattern = /^([a-f0-9]{64})  (.+)$/i;

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trimEnd();
    if (!trimmed) continue;
    const match = trimmed.match(linePattern);
    if (!match) continue;
    entries.set(match[2], match[1].toLowerCase());
  }

  return entries;
}
