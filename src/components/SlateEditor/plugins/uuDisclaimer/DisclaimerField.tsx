/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TextArea, FieldRoot, FieldHelper, FieldErrorMessage } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ContentEditableFieldLabel } from "../../../Form/ContentEditableFieldLabel";
import { FieldWarning } from "../../../Form/FieldWarning";
import { FormField } from "../../../FormField";
import { SlatePlugin } from "../../interfaces";
import RichTextEditor from "../../RichTextEditor";
import { CategoryFilters, createToolbarAreaOptions } from "../toolbar/toolbarState";

export const toolbarAreaFilters = createToolbarAreaOptions();

const StyledTextArea = styled(TextArea, {
  base: {
    minHeight: "surface.3xsmall",
    height: "unset",
  },
});

interface Props {
  submitted: boolean;
  title: string;
  description: string;
  plugins: SlatePlugin[];
  toolbarOptions: CategoryFilters;
}

export const DisclaimerField = ({ submitted, title, description, plugins, toolbarOptions }: Props) => {
  return (
    <FormField name="disclaimer">
      {({ field, meta, helpers }) => (
        <FieldRoot invalid={!!meta.error}>
          <ContentEditableFieldLabel>{title}</ContentEditableFieldLabel>
          <FieldHelper textStyle="body.medium">{description}</FieldHelper>
          <StyledTextArea asChild>
            <RichTextEditor
              {...field}
              submitted={submitted}
              onChange={helpers.setValue}
              hideBlockPicker
              plugins={plugins}
              toolbarOptions={toolbarOptions}
              toolbarAreaFilters={toolbarAreaFilters}
              noArticleStyling
              data-testid="disclaimer-editor"
            />
          </StyledTextArea>
          <FieldWarning name={field.name} />
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        </FieldRoot>
      )}
    </FormField>
  );
};
