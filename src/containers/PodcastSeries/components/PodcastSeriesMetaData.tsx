/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { CheckLine } from "@ndla/icons/editor";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  FieldErrorMessage,
  FieldLabel,
  FieldRoot,
} from "@ndla/primitives";
import { FormField } from "../../../components/FormField";
import FormikField from "../../../components/FormikField";
import { FormContent } from "../../../components/FormikForm";
import PlainTextEditor from "../../../components/SlateEditor/PlainTextEditor";
import { textTransformPlugin } from "../../../components/SlateEditor/plugins/textTransform";
import { MetaImageSearch, TitleField } from "../../FormikForm";

interface Props {
  language?: string;
  onImageLoad?: (width: number, height: number) => void;
  hasRSS?: boolean;
}

const PodcastSeriesMetaData = ({ language, onImageLoad }: Props) => {
  const { t } = useTranslation();
  const plugins = [textTransformPlugin];
  return (
    <FormContent>
      <TitleField hideToolbar />

      <FormField name="description">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <FieldLabel>{t("podcastSeriesForm.description")}</FieldLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <PlainTextEditor
              id={field.name}
              placeholder={t("podcastSeriesForm.description")}
              {...field}
              plugins={plugins}
            />
          </FieldRoot>
        )}
      </FormField>

      <FormikField name="coverPhotoId">
        {({ field, form }) => (
          <MetaImageSearch
            onImageLoad={onImageLoad}
            metaImageId={field.value}
            setFieldTouched={form.setFieldTouched}
            showRemoveButton
            language={language}
            podcastFriendly={true}
            disableAltEditing={true}
            {...field}
          />
        )}
      </FormikField>

      <FormField name="hasRSS">
        {({ field, helpers }) => (
          <FieldRoot>
            <CheckboxRoot checked={field.value} onCheckedChange={(details) => helpers.setValue(details.checked)}>
              <CheckboxControl>
                <CheckboxIndicator asChild>
                  <CheckLine />
                </CheckboxIndicator>
              </CheckboxControl>
              <CheckboxLabel>{t("podcastSeriesForm.hasRSS")}</CheckboxLabel>
              <CheckboxHiddenInput />
            </CheckboxRoot>
          </FieldRoot>
        )}
      </FormField>
    </FormContent>
  );
};

export default PodcastSeriesMetaData;
