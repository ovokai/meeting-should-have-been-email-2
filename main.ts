// The Meeting That Should Have Been an Email — make.fun one-line entry.
//
// The whole entry is a single joke line. This program writes it to
// /output/entry.txt, which is where the competition's sealed scorer
// looks for it. If /output is not writable (running locally, outside
// the grader's sandbox), it falls back to an entry.txt next to this
// file so the line can still be inspected.

import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The joke itself: one line, plain text, at most 200 characters.
// The turn is saved for the last clause — the reply the whole room
// debated was typable in the first four minutes of the meeting.
const LINE =
  "Twelve of us spent an hour watching one colleague read a two-sentence email aloud, then debate the reply he could have typed in the first four minutes.";

// The gate rejects anything over 200 characters or not plain text.
const MAX_CHARS = 200;

/** Guard rails mirroring the competition's gate, checked before writing. */
function validate(line: string): void {
  if (line.length === 0) {
    throw new Error("entry line is empty");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(`entry line is ${line.length} chars, over the ${MAX_CHARS} limit`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
}

/** Write text to a path, creating parent directories as needed. */
function writeLineTo(path: string, text: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, "utf8");
}

/**
 * Deliver the line to a path and read it back, so a silent short
 * write can never turn into a failed gate at grading time.
 */
function deliver(path: string): void {
  writeLineTo(path, LINE);
  const back = readFileSync(path, "utf8");
  if (back !== LINE) {
    throw new Error(`read-back mismatch at ${path}`);
  }
  console.log(`wrote ${path} (${LINE.length} chars)`);
}

/** Deliver the line to /output/entry.txt, with a local fallback. */
function main(): void {
  validate(LINE);
  try {
    deliver("/output/entry.txt");
  } catch {
    const here = dirname(fileURLToPath(import.meta.url));
    deliver(join(here, "entry.txt"));
  }
}

main();
