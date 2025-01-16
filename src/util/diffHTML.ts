/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Diff, diff_match_patch } from "diff-match-patch";
import HtmlDiff from "htmldiff-js";

const differ = new diff_match_patch();

const allowedConversions = [
  ["&#x27;", "'"],
  ["&quot;", '"'],
];
const brWrappers = ["strong", "em", "u", "code", "sup", "sub"];
const tagRegexes = brWrappers.map((tag) => new RegExp(`</${tag}><${tag}>`, "g"));

interface Value {
  current: string;
  next: string;
  previous: string;
}

/**
 * Get current, next and previous diff values. Return undefined if one of them is undefined
 */
function getValues(index: number, diffs: Diff[]) {
  const prevDiff = diffs[index - 1];
  const nextDiff = diffs[index + 1];
  const diff = diffs[index];

  if (prevDiff === undefined || nextDiff === undefined || diff === undefined) {
    return undefined;
  }
  return {
    current: diff[1],
    next: nextDiff[1],
    previous: prevDiff[1],
  };
}

// I.E "<h2>Oppgaver</h2> <ol>...</ol>" -> "<h2>Oppgaver</h2><ol>...</ol>"
function allowSpaceRemovalBetweenTags({ current, next, previous }: Value) {
  return previous[previous.length] !== ">" && current === " " && next[0] === "<";
}

// I.E "<table><tbody>...</tbody></table>" -> "<table><thead>...</thead><tbody>...</tbody></table>"
function allowTHeadInsertion({ current, next, previous }: Value) {
  return previous.endsWith("<table><t") && current === "body" && next === "head";
}

// I.E "<p>some "text".</p>" -> "<p>some &quot;text&quot;.</p>"
function allowQuotEntityReplacement({ current, next }: Value) {
  for (const pair of allowedConversions) {
    if (current === pair[1] && next === pair[0]) {
      return true;
    }
    if (
      current.startsWith(pair[0]) &&
      next.startsWith(pair[1]) &&
      current.endsWith(pair[0]) &&
      next.endsWith(pair[1])
    ) {
      return true;
    }
  }
  return false;
}

// I.E "<h6>...</h6>" -> "<h3>...</h3>"
function allowHeadingConversion({ current, next, previous }: Value) {
  return (
    (previous.endsWith("</h") || previous.endsWith("<h")) &&
    (current === "4" || current === "5" || current === "6") &&
    next === "3"
  );
}

// I.E "<mo>&#xa0;</mo>" -> "<mo>&nbsp;</mo>"
function allowSpaceReplacement({ current, next }: Value) {
  return current === "#xa0" && next === "nbsp";
}

// I.E "<mo>&#xa0;</mo>" -> "<mo>&nbsp;</mo>"
function allowStrongRemoval({ current, next, previous }: Value) {
  // I.E. <strong><math>...</math></strong> -> <math>...</math>
  if (current === "strong><" && next.startsWith("math")) {
    return true;
  }
  // I.E. <strong><math>...</math></strong> -> <math>...</math>
  if (current === "strong></" && previous.endsWith("</math></")) {
    return true;
  }
  // I.E. <strong>one</strong><strong>two</strong> -> <strong>onetwo</strong>
  if (brWrappers.some((tag) => current.includes(`/${tag}><${tag}`))) {
    return true;
  }
  return false;
}
function allowBrWrapping({ current }: Value) {
  return current === "br/";
}

// I.E. <br/> => <br>
function allowSlashRemoval({ current, next }: Value) {
  return current === "/" && next.startsWith(">");
}

const removalFns = [
  allowSpaceRemovalBetweenTags,
  allowTHeadInsertion,
  allowHeadingConversion,
  allowQuotEntityReplacement,
  allowSpaceReplacement,
  allowStrongRemoval,
  allowSlashRemoval,
  allowBrWrapping,
];

function isRemovalAllowed(index: number, diffs: Diff[]) {
  const values = getValues(index, diffs);
  if (values) {
    return removalFns.some((fn) => fn(values));
  }
  return false;
}

const cleanUpHtml = (newHtml: string) =>
  tagRegexes.reduce((currString, currRegExp) => currString.replace(currRegExp, ""), newHtml);

function removeNoise(html: string): string {
  // we remove some noise coming from Slate, ex </strong><strong>
  // we run it twice to remove nested mark tags
  return cleanUpHtml(cleanUpHtml(html));
}

export function getDiff(oldHtml: string, newHtml: string): string {
  const unifiedDiff = HtmlDiff.execute(oldHtml, newHtml) as string;
  const parser = new DOMParser();
  const parsedDiff = parser.parseFromString(unifiedDiff, "text/html");
  parsedDiff.querySelectorAll("del.diffmod").forEach((el) => el.remove());
  return parsedDiff.body.innerHTML;
}

export function diffHTML(oldHtml: string, newHtml: string) {
  const cleanHtml = removeNoise(newHtml);

  const diffs = differ.diff_main(oldHtml, cleanHtml);
  differ.diff_cleanupEfficiency(diffs);

  for (const [index, diff] of diffs.entries()) {
    const [result] = diff;
    if (result === 1) {
      // Some diffs are allowed
      if (!isRemovalAllowed(index, diffs)) {
        return true;
      }
    } else if (result === -1) {
      // Some diffs are allowed
      if (!isRemovalAllowed(index, diffs)) {
        return true;
      }
    }
  }
  return false;
}
