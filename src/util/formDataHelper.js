/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const createFormData = (metadata, file) =>
  new Promise(resolve => {
    const form = new FormData();
    form.append('metadata', JSON.stringify(metadata));
    form.append('file', file);
    resolve(form);
  });
