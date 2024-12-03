/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const getTagName = (id: string | undefined, data: { id: string; name: string }[] = []) => {
  return id ? data.find((entry) => entry.id === id)?.name : undefined;
};
