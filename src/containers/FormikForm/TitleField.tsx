/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { FieldErrorMessage, Label } from "@ndla/forms";
import { FormControl, FormField } from "../../components/FormField";
import PlainTextEditor from "../../components/SlateEditor/PlainTextEditor";

import saveHotkeyPlugin from "../../components/SlateEditor/plugins/saveHotkey";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";

interface Props {
  maxLength?: number;
  name?: string;
  type?: string;
}

const StyledFormControl = styled(FormControl)`
  margin-top: 2rem;
  [data-plain-text-editor] {
    font-size: 2.11111rem;
  }
`;

const TitleField = ({ maxLength = 256, name = "title" }: Props) => {
  const { t } = useTranslation();

  const plugins = useMemo(() => [textTransformPlugin, saveHotkeyPlugin], []);

  return (
    <FormField name={name}>
      {({ field, meta }) => (
        <StyledFormControl isRequired isInvalid={!!meta.error}>
          <Label visuallyHidden>{t("form.title.label")}</Label>
          <PlainTextEditor
            id={field.name}
            {...field}
            className="title"
            placeholder={t("form.title.label")}
            data-plain-text-editor=""
            data-testid="learning-resource-title"
            plugins={plugins}
            maxLength={maxLength}
          />
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        </StyledFormControl>
      )}
    </FormField>
  );
};

export default memo(TitleField);
