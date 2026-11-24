// Two-Sentence Horror — grind3-horror-20261124
//
// The whole entry lives in the STORY constant below. This program's only
// job is to check that text against the competition gate and then write
// it, untouched, to entry.txt inside the chosen output directory.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Sentence one is an ordinary favour — feeding a neighbour's cat while
// they are away — with one detail quietly wrong: the cat is always
// already cared for. Sentence two offers a plain, mechanical fact about
// a door, and that fact is what turns the wrong detail into a person
// who was in the house, unseen, the whole time.
const STORY =
  "While the Patels were in Lisbon, I let myself in at seven each morning to feed their tabby, Mina, and every morning her bowl was already full and her litter tray already clean. On the seventh morning, my key turned but the door would not move, because it had been bolted from inside.";

// The gate: UTF-8 text, 1 to 400 characters, exactly two sentences.
const MIN_CHARS = 1;
const MAX_CHARS = 400;

function countSentences(text: string): number {
  // A sentence here ends at a terminal ., ! or ? — the story uses plain
  // full stops only, so counting those marks is the whole check.
  const endings = text.match(/[.!?]/g);
  return endings === null ? 0 : endings.length;
}

function checkStory(text: string): void {
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    throw new Error(
      `story is ${text.length} characters; the gate allows ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  if (text.includes("\n")) {
    throw new Error("story must sit on a single line");
  }
  const sentences = countSentences(text);
  if (sentences !== 2) {
    throw new Error(`story has ${sentences} sentence endings; exactly two are required`);
  }
}

function main(): void {
  checkStory(STORY);

  // The grader may mount the output directory, so it is only ever
  // created (recursively) — never removed.
  const outputDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outputDir, { recursive: true });

  const target = join(outputDir, "entry.txt");
  writeFileSync(target, STORY, "utf8");

  // Read the file back and compare it to the intended story: a short
  // or altered write would otherwise ship silently to the grader.
  const written = readFileSync(target, "utf8");
  if (written !== STORY) {
    throw new Error(
      `entry.txt does not match the intended story (read back ${written.length} characters, expected ${STORY.length})`,
    );
  }

  console.log(`wrote ${target} (${STORY.length} characters, 2 sentences)`);
}

main();
