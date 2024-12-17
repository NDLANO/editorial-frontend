/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from "react";
import { CloseLine, ArrowDownShortLine } from "@ndla/icons";
import { IconButton, InputContainer } from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";
import {
  TagSelectorClearTrigger,
  TagSelectorControl,
  TagSelectorInput,
  TagSelectorTrigger,
  TagSelectorInputProps,
} from "@ndla/ui";

interface Props extends TagSelectorInputProps {}

export const SearchTagsTagSelectorInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <HStack gap="3xsmall">
      <TagSelectorControl asChild>
        <InputContainer>
          <TagSelectorInput {...props} ref={ref} />
          <TagSelectorClearTrigger asChild>
            <IconButton variant="clear">
              <CloseLine />
            </IconButton>
          </TagSelectorClearTrigger>
        </InputContainer>
      </TagSelectorControl>
      <TagSelectorTrigger asChild>
        <IconButton variant="secondary">
          <ArrowDownShortLine />
        </IconButton>
      </TagSelectorTrigger>
    </HStack>
  );
});
