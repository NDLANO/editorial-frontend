/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { AudioFormikType } from "./AudioForm";
import AsyncSearchTags from "../../../components/Dropdown/asyncDropdown/AsyncSearchTags";
import FormikField from "../../../components/FormikField";
import { fetchSearchTags } from "../../../modules/audio/audioApi";

const AudioMetaData = () => {
  const {
    values: { language, tags },
  } = useFormikContext<AudioFormikType>();
  const { t } = useTranslation();
  return (
    <>
      <FormikField name="tags" label={t("form.tags.label")} obligatory description={t("form.tags.description")}>
        {({ field, form }: FieldProps<string[], string[]>) => (
          <AsyncSearchTags
            multiSelect
            language={language}
            initialTags={tags}
            field={field}
            form={form}
            fetchTags={fetchSearchTags}
          />
        )}
      </FormikField>
    </>
  );
};

export default AudioMetaData;
