/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const getConditionalClassnames = function(userAgentString?: string) {
  if (!userAgentString) return '';
  if (userAgentString.indexOf('MSIE') >= 0) {
    return 'ie lt-ie11';
  }
  if (userAgentString.indexOf('Trident/7.0; rv:11.0') >= 0) {
    return 'ie gt-ie10';
  }
  return '';
};
export default getConditionalClassnames;
