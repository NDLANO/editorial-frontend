/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldErrorMessage, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useTranslation } from "react-i18next";
import { FieldWarning } from "../../../components/Form/FieldWarning";
import { FormRemainingCharacters } from "../../../components/Form/FormRemainingCharacters";
import { FormField } from "../../../components/FormField";
import PlainTextEditor from "../../../components/SlateEditor/PlainTextEditor";
import { textTransformPlugin } from "../../../components/SlateEditor/plugins/textTransform";
import { MetaImageSearch } from "../../FormikForm";

const StyledFormRemainingCharacters = styled(FormRemainingCharacters, {
  base: {
    marginInlineStart: "auto",
  },
});

interface Props {
  language?: string;
  onImageLoad?: (width: number, height: number) => void;
}

const plugins = [textTransformPlugin];

const PodcastMetaData = ({ language, onImageLoad }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <FormField name="introduction">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <FieldLabel>{t("podcastForm.fields.introduction")}</FieldLabel>
            <PlainTextEditor
              id={field.name}
              {...field}
              placeholder={t("podcastForm.fields.introduction")}
              plugins={plugins}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <StyledFormRemainingCharacters maxLength={300} value={field.value} />
            <FieldWarning name={field.name} />
          </FieldRoot>
        )}
      </FormField>
      <FormField name="coverPhotoId">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <MetaImageSearch
              metaImageId={field.value}
              showRemoveButton
              onImageLoad={onImageLoad}
              language={language}
              podcastFriendly={true}
              disableAltEditing={true}
              showCheckbox={false}
              {...field}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
    </>
  );
};

export default PodcastMetaData;
