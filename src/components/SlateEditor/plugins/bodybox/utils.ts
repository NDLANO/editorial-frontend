/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from 'slate-hyperscript';

export const TYPE_BODYBOX = 'bodybox';

export const defaultBodyboxBlock = () =>
  slatejsx('element', { type: TYPE_BODYBOX }, [{ text: '' }]);
