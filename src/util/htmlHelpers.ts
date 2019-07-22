/* eslint-disable no-useless-escape */
/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const el = document.createElement('html');

export const getIframeSrcFromHtmlString = (html: string) => {
  el.innerHTML = html;
  const iframe = el.getElementsByTagName('iframe')[0];
  return iframe.getAttribute('src');
};

export const urlAsATag = (url: string) => {
  const a = document.createElement('a');
  a.href = url;
  return a;
};

export const urlDomain = (url: string) => {
  const a = urlAsATag(url);
  return a.hostname;
};

export const isValidURL = (string: string) =>
  string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  ) || false;
