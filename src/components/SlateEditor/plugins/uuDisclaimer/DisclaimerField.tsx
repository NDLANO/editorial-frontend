/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { TextArea, FieldRoot, FieldHelper, FieldErrorMessage } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ContentEditableFieldLabel } from "../../../Form/ContentEditableFieldLabel";
import { FieldWarning } from "../../../Form/FieldWarning";
import { FormField } from "../../../FormField";
import { SlatePlugin } from "../../interfaces";
import RichTextEditor from "../../RichTextEditor";
import { UnsupportedElement } from "../unsupported/UnsupportedElement";

export const DISCLAIMER_TEMPLATES_URL =
  "https://docs.google.com/spreadsheets/d/1g8cCqgS4BvaChHX4R6VR5V5Q83fvYcMrgneBJMkLWYs/edit";

const StyledTextArea = styled(TextArea, {
  base: {
    minHeight: "surface.3xsmall",
    height: "unset",
  },
});

interface Props {
  submitted: boolean;
  title: string;
  description: ReactNode;
  plugins: SlatePlugin[];
}

export const DisclaimerField = ({ submitted, title, description, plugins }: Props) => {
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
              renderInvalidElement={(props) => <UnsupportedElement {...props} />}
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
