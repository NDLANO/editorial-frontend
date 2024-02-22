/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { CheckboxItem, Label } from "@ndla/forms";
import { CheckboxWrapper } from "../../../components/Form/styles";
import { FormControl, FormField } from "../../../components/FormField";
import FormikField from "../../../components/FormikField";
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
    <>
      <TitleField hideToolbar />

      <FormikField name="description" label={t("podcastSeriesForm.description")}>
        {({ field }) => (
          <PlainTextEditor
            id={field.name}
            placeholder={t("podcastSeriesForm.description")}
            {...field}
            plugins={plugins}
          />
        )}
      </FormikField>

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
        {({ field }) => (
          <FormControl>
            <CheckboxWrapper>
              <CheckboxItem
                checked={field.value}
                onCheckedChange={() =>
                  field.onChange({
                    target: {
                      name: field.name,
                      value: !field.value,
                    },
                  })
                }
              />
              <Label margin="none" textStyle="label-small">
                {t("podcastSeriesForm.hasRSS")}
              </Label>
            </CheckboxWrapper>
          </FormControl>
        )}
      </FormField>
    </>
  );
};

export default PodcastSeriesMetaData;
