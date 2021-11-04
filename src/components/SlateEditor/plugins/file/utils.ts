/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx } from 'slate-hyperscript';
import { TYPE_FILE } from '.';

export const defaultFileBlock = (data: DOMStringMap[]) => {
  return jsx('element', { type: TYPE_FILE, data }, [{ text: '' }]);
};
