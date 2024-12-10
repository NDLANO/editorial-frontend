/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RefObject } from "react";

// keyboard scrolling does not work properly when items are not nested directly within
// ComboboxContent, so we need to provide a custom scroll function
// TODO: Check if ark provides a better fix for this.
export const scrollToIndexFn = (contentRef: RefObject<HTMLDivElement | null>, index: number) => {
  const el = contentRef.current?.querySelectorAll(`[role='option']`)[index];
  el?.scrollIntoView({ behavior: "auto", block: "nearest" });
};

export const getTagName = (id: string | undefined, data: { id: string; name: string }[] = []) => {
  return id ? data.find((entry) => entry.id === id)?.name : undefined;
};
