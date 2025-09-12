/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TagsInputContext } from "@ark-ui/react";
import { CloseLine } from "@ndla/icons";
import {
  IconButton,
  InputContainer,
  TagsInputClearTrigger,
  TagsInputControl,
  TagsInputInput,
  TagsInputInputProps,
  TagsInputItem,
  TagsInputItemDeleteTrigger,
  TagsInputItemInput,
  TagsInputItemPreview,
  TagsInputItemText,
} from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";

export const GenericTagsInputInput = (props: TagsInputInputProps) => {
  return (
    <HStack gap="3xsmall">
      <TagsInputContext>
        {(api) => (
          <TagsInputControl asChild>
            <InputContainer>
              {api.value.map((value, index) => (
                <TagsInputItem key={index} index={index} value={value}>
                  <TagsInputItemPreview>
                    <TagsInputItemText>{value}</TagsInputItemText>
                    <TagsInputItemDeleteTrigger>
                      <CloseLine />
                    </TagsInputItemDeleteTrigger>
                  </TagsInputItemPreview>
                  <TagsInputItemInput />
                </TagsInputItem>
              ))}
              <TagsInputInput {...props} />
              <TagsInputClearTrigger asChild>
                <IconButton variant="clear">
                  <CloseLine />
                </IconButton>
              </TagsInputClearTrigger>
            </InputContainer>
          </TagsInputControl>
        )}
      </TagsInputContext>
    </HStack>
  );
};
