/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import usePreventWindowUnload from "./preventWindowUnloadHook";

interface Props {
  preventUnload: boolean;
}
export const PreventWindowUnload = ({ preventUnload }: Props) => {
  usePreventWindowUnload(preventUnload);
  return null;
};
