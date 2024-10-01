/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { IAuthor } from "@ndla/types-backend/article-api";
import { CopyrightEmbedData } from "@ndla/types-embed";
import { CopyrightFieldGroup } from "../../../../containers/FormikForm";
import { useLicenses } from "../../../../modules/draft/draftQueries";
import { DEFAULT_LICENSE } from "../../../../util/formHelper";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";

interface Props {
  embedData?: CopyrightEmbedData;
  onSave: (values: CopyrightEmbedData) => void;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  license: string;
  creators: IAuthor[];
  processors: IAuthor[];
  rightsholders: IAuthor[];
  processed: boolean;
  origin?: string;
}

const toInitialValues = (embedData?: CopyrightEmbedData): FormValues => {
  const copyright = embedData?.copyright;
  return {
    title: embedData?.title ?? "",
    license: copyright?.license.license ?? DEFAULT_LICENSE.license,
    creators: copyright?.creators ?? [],
    processors: copyright?.processors ?? [],
    rightsholders: copyright?.rightsholders ?? [],
    processed: copyright?.processed || false,
    origin: copyright?.origin,
  };
};

const rules: RulesType<FormValues> = {
  creators: {
    rules: {
      name: {
        required: true,
        translationKey: "form.name.name",
      },
      type: {
        required: true,
        translationKey: "form.name.type",
      },
    },
  },
  processors: {
    rules: {
      name: {
        required: true,
        translationKey: "form.name.name",
      },
      type: {
        required: true,
        translationKey: "form.name.type",
      },
    },
  },
  rightsholders: {
    rules: {
      name: {
        required: true,
        translationKey: "form.name.name",
      },
      type: {
        required: true,
        translationKey: "form.name.type",
      },
    },
  },
  license: {
    required: false,
    test: (values) => {
      const authors = values.creators.concat(values.rightsholders).concat(values.processors);
      if (values.license === "N/A" || authors.length > 0) return undefined;
      return { translationKey: "validation.noLicenseWithoutCopyrightHolder" };
    },
  },
};

export const EmbedCopyrightForm = ({ embedData, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(embedData), [embedData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);
  const licensesQuery = useLicenses();

  const onSubmit = useCallback(
    (values: FormValues) => {
      onSave({
        resource: "copyright",
        title: values.title,
        copyright: {
          creators: values.creators,
          processors: values.processors,
          rightsholders: values.rightsholders,
          processed: values.processed,
          origin: values.origin,
          license: licensesQuery.data?.find((license) => license.license === values.license) ?? DEFAULT_LICENSE,
        },
      });
    },
    [licensesQuery.data, onSave],
  );

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={onSubmit}
      validateOnMount
      validate={(values) => validateFormik(values, rules, t)}
    >
      {({ dirty, isValid }) => (
        <FormikForm>
          <FormField name="title">
            {({ field, meta }) => (
              <FieldRoot invalid={!!meta.error}>
                <FieldLabel>{t("form.title.label")}</FieldLabel>
                <FieldInput {...field} />
              </FieldRoot>
            )}
          </FormField>
          <CopyrightFieldGroup />
          <FormActionsContainer>
            <Button variant="secondary" onClick={onCancel}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!dirty || !isValid}>
              {t("save")}
            </Button>
          </FormActionsContainer>
        </FormikForm>
      )}
    </Formik>
  );
};
