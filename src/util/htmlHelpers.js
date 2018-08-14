/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const urlDomain = url => {
  const a = document.createElement('a');
  a.href = url;
  return a.hostname;
};
