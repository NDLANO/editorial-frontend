/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps } from "formik";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import SubjectpageBanner from "./SubjectpageBanner";
import FormikField from "../../../components/FormikField";
import PlainTextEditor from "../../../components/SlateEditor/PlainTextEditor";
import { textTransformPlugin } from "../../../components/SlateEditor/plugins/textTransform";

const ImageWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: ${spacing.normal};
  > * {
    flex: 1;
  }
`;

const SubjectpageMetadata = () => {
  const { t } = useTranslation();
  const plugins = [textTransformPlugin];
  return (
    <>
      <FormikField
        name="metaDescription"
        maxLength={300}
        showMaxLength
        label={t("form.metaDescription.label")}
        description={t("form.metaDescription.description")}
      >
        {({ field, form: { isSubmitting } }: FieldProps) => (
          <PlainTextEditor
            id={field.name}
            {...field}
            submitted={isSubmitting}
            placeholder={t("form.metaDescription.label")}
            plugins={plugins}
          />
        )}
      </FormikField>
      <ImageWrapper>
        <FormikField name="desktopBannerId">
          {() => <SubjectpageBanner title={t("form.name.desktopBannerId")} fieldName={"desktopBannerId"} />}
        </FormikField>
        <FormikField name="mobileBannerId">
          {() => <SubjectpageBanner title={t("form.name.mobileBannerId")} fieldName={"mobileBannerId"} />}
        </FormikField>
      </ImageWrapper>
    </>
  );
};

export default SubjectpageMetadata;
