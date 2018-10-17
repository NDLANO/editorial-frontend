/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const chalk = require('chalk');
const Differ = require('diff-match-patch');

const differ = new Differ();

/**
 * Get current, next and previous diff values. Return undefined if one of them is undefiend
 */
function getValues(index, diffs) {
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
function allowSpaceRemovalBetweenTags({ current, next, previous }) {
  return (
    previous[previous.length] !== '>' && current === ' ' && next[0] === '<'
  );
}

// I.E "<table><tbody>...</tbody></table>" -> "<table><thead>...</thead><tbody>...</tbody></table>"
function allowTHeadInsertion({ current, next, previous }) {
  return (
    previous.endsWith('<table><t') && current === 'body' && next === 'head'
  );
}

// I.E "<h6>...</h6>" -> "<h3>...</h3>"
function allowHeadingConversion({ current, next, previous }) {
  return (
    (previous.endsWith('</h') || previous.endsWith('<h')) &&
    (current === '4' || current === '5' || current === '6') &&
    next === '3'
  );
}

function isRemovalAllowed(index, diffs) {
  const values = getValues(index, diffs);
  if (values) {
    const result = [
      allowSpaceRemovalBetweenTags,
      allowTHeadInsertion,
      allowHeadingConversion,
    ].find(fn => fn(values) === true);
    return result !== undefined;
  }
  return false;
}

function diffHTML(oldHtml, newHtml) {
  const diffs = differ.diff_main(oldHtml, newHtml);
  differ.diff_cleanupSemantic(diffs);
  let diffString = '';

  let shouldWarn = false;

  diffs.forEach((diff, index) => {
    // green for additions, red for deletions
    // grey for common parts
    const [result, value] = diff;
    if (result === 1) {
      diffString += `${chalk.green(value)}`;
    } else if (result === -1) {
      diffString += `${chalk.red(value)}`;
      // Some diffs are allowed
      if (!isRemovalAllowed(index, diffs)) {
        shouldWarn = true;
      }
    } else {
      diffString += value;
    }
  });
  return { diff: diffString, warn: shouldWarn };
}

module.exports = diffHTML;
