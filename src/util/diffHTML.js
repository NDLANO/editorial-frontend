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

const allowedConversions = [
  ['&#x27;', "'"],
  ['&quot;', '"'],
];
const brWrappers = ['strong', 'em', 'u', 'code'];

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
  return previous[previous.length] !== '>' && current === ' ' && next[0] === '<';
}

// I.E "<table><tbody>...</tbody></table>" -> "<table><thead>...</thead><tbody>...</tbody></table>"
function allowTHeadInsertion({ current, next, previous }) {
  return previous.endsWith('<table><t') && current === 'body' && next === 'head';
}

// I.E "<p>some "text".</p>" -> "<p>some &quot;text&quot;.</p>"
function allowQuotEntityReplacement({ current, next }) {
  const result = allowedConversions.map(pair => {
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
    return false;
  });
  return result.find(res => res);
}

// I.E "<h6>...</h6>" -> "<h3>...</h3>"
function allowHeadingConversion({ current, next, previous }) {
  return (
    (previous.endsWith('</h') || previous.endsWith('<h')) &&
    (current === '4' || current === '5' || current === '6') &&
    next === '3'
  );
}

// I.E "<mo>&#xa0;</mo>" -> "<mo>&nbsp;</mo>"
function allowSpaceReplacement({ current, next }) {
  return current === '#xa0' && next === 'nbsp';
}

// I.E "<mo>&#xa0;</mo>" -> "<mo>&nbsp;</mo>"
function allowStrongRemoval({ current, next, previous }) {
  // I.E. <strong><math>...</math></strong> -> <math>...</math>
  if (current === 'strong><' && next.startsWith('math')) {
    return true;
  }
  // I.E. <strong><math>...</math></strong> -> <math>...</math>
  if (current === 'strong></' && previous.endsWith('</math></')) {
    return true;
  }
  // I.E. <strong>one</strong><strong>two</strong> -> <strong>onetwo</strong>
  if (brWrappers.some(tag => current.includes(`/${tag}><${tag}`))) {
    return true;
  }
  return false;
}
function allowBrWrapping({ current, next }) {
  if (current === 'br/') {
    return true;
  }
  return false;
}

// I.E. <br/> => <br>
function allowSlashRemoval({ current, next }) {
  return current === '/' && next.startsWith('>');
}

function isRemovalAllowed(index, diffs) {
  const values = getValues(index, diffs);
  if (values) {
    const result = [
      allowSpaceRemovalBetweenTags,
      allowTHeadInsertion,
      allowHeadingConversion,
      allowQuotEntityReplacement,
      allowSpaceReplacement,
      allowStrongRemoval,
      allowSlashRemoval,
      allowBrWrapping,
    ].find(fn => fn(values) === true);
    return result !== undefined;
  }
  return false;
}

const cleanUpHtml = newHtml =>
  brWrappers
    .map(tag => new RegExp(`</${tag}><${tag}>`, 'g'))
    .reduce((currString, currRegExp) => currString.replace(currRegExp, ''), newHtml);

export function diffHTML(oldHtml, newHtml) {
  // we remove some noise coming from Slate, ex </strong><strong>
  // we run it twice to remove nested mark tags
  const cleanHtml = cleanUpHtml(cleanUpHtml(newHtml));

  const diffs = differ.diff_main(oldHtml, cleanHtml);
  differ.diff_cleanupEfficiency(diffs);
  let diffString = '';

  let shouldWarn = false;

  logDiff(diffs);

  diffs.forEach((diff, index) => {
    // green for additions, red for deletions
    // grey for common parts
    const [result, value] = diff;
    if (result === 1) {
      diffString += `${chalk.underline.green(value)}`;
      // Some diffs are allowed
      if (!isRemovalAllowed(index, diffs)) {
        shouldWarn = true;
      }
    } else if (result === -1) {
      diffString += `${chalk.underline.red(value)}`;
      // Some diffs are allowed
      if (!isRemovalAllowed(index, diffs)) {
        shouldWarn = true;
      }
    }
  });
  return { diff: diffString, warn: shouldWarn };
}

const logDiff = diffs => {
  // TODO: Remove before releasing beta ed.
  // eslint-disable-next-line no-console
  console.log(
    diffs.map(diff => {
      let result = diff[0];
      if (result === 1) {
        diff[0] = 'removed';
      } else if (result === -1) {
        diff[0] = 'added';
      } else {
        diff[0] = '';
      }

      return diff;
    }),
  );
};
