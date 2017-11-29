/**
* Copyright (c) 2016-present, NDLA.
*
* This source code is licensed under the GPLv3 license found in the
* LICENSE file in the root directory of this source tree. *
*/

export const DEFAULT_LICENSE = {
  description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
  license: 'by-sa',
  url: 'https://creativecommons.org/licenses/by-sa/2.0/',
};

export const parseCopyrightAuthors = (obj, type) => {
  if (!obj.copyright) {
    return [];
  }
  if (obj.copyright.authors) {
    return obj.copyright.authors
      .filter(author => author.type === type)
      .map(author => author.name);
  }
  return obj.copyright.creators
    .filter(author => author.type === type)
    .map(author => author.name);
};
