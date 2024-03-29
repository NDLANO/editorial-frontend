/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { MetaImageSearch } from ".";
import AvailabilityField from "./components/AvailabilityField";
import AsyncSearchTags from "../../components/Dropdown/asyncDropdown/AsyncSearchTags";
import { FormField } from "../../components/FormField";
import FormikField from "../../components/FormikField";
import PlainTextEditor from "../../components/SlateEditor/PlainTextEditor";
import { textTransformPlugin } from "../../components/SlateEditor/plugins/textTransform";
import { DRAFT_ADMIN_SCOPE } from "../../constants";
import { fetchSearchTags } from "../../modules/draft/draftApi";
import { useSession } from "../Session/SessionProvider";

interface Props {
  articleLanguage: string;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3) => void;
}

const MetaDataField = ({ articleLanguage, showCheckbox, checkboxAction }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const plugins = [textTransformPlugin];

  return (
    <>
      <FormikField name="tags" label={t("form.tags.label")} showError description={t("form.tags.description")}>
        {({ field, form }) => (
          <AsyncSearchTags
            multiSelect
            initialTags={field.value}
            language={articleLanguage}
            field={field}
            form={form}
            fetchTags={fetchSearchTags}
          />
        )}
      </FormikField>
      {userPermissions?.includes(DRAFT_ADMIN_SCOPE) && (
        <FormField name="availability">{({ field }) => <AvailabilityField field={field} />}</FormField>
      )}
      <FormikField
        name="metaDescription"
        maxLength={155}
        showMaxLength
        label={t("form.metaDescription.label")}
        description={t("form.metaDescription.description")}
      >
        {({ field }) => (
          <PlainTextEditor id={field.name} placeholder={t("form.metaDescription.label")} {...field} plugins={plugins} />
        )}
      </FormikField>
      <FormikField name="metaImageId">
        {({ field, form }) => (
          <MetaImageSearch
            metaImageId={field.value}
            setFieldTouched={form.setFieldTouched}
            showRemoveButton={false}
            showCheckbox={showCheckbox}
            checkboxAction={checkboxAction}
            language={articleLanguage}
            {...field}
          />
        )}
      </FormikField>
    </>
  );
};

export default memo(MetaDataField);
