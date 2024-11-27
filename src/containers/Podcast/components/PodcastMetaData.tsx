/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { FieldErrorMessage, FieldRoot } from "@ndla/primitives";
import { FormField } from "../../../components/FormField";
import FormikField from "../../../components/FormikField";
import PlainTextEditor from "../../../components/SlateEditor/PlainTextEditor";
import { textTransformPlugin } from "../../../components/SlateEditor/plugins/textTransform";
import { MetaImageSearch } from "../../FormikForm";

interface Props {
  language?: string;
  onImageLoad?: (width: number, height: number) => void;
}

const plugins = [textTransformPlugin];

const PodcastMetaData = ({ language, onImageLoad }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <FormikField label={t("podcastForm.fields.introduction")} name="introduction" maxLength={1000} showMaxLength>
        {({ field }) => (
          <PlainTextEditor
            id={field.name}
            {...field}
            placeholder={t("podcastForm.fields.introduction")}
            plugins={plugins}
          />
        )}
      </FormikField>
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
