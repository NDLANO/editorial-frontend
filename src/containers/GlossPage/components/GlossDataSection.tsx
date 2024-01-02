/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { FieldHeader, FieldSection, Input, Select } from "@ndla/forms";
import { IGlossData } from "@ndla/types-backend/concept-api";
import { constants } from "@ndla/ui";
import ExamplesFieldArray from "./ExamplesFieldArray";
import TranscriptionsField from "./TranscriptionsField";
import FormikField from "../../../components/FormikField";
import { LANGUAGES } from "../glossData";

const StyledFormikField = styled(FormikField)`
  margin-top: 0px;
`;

const GlossDataSection = () => {
  const [_, { value }] = useField<IGlossData>("gloss");
  const { t } = useTranslation();

  const {
    wordClass: { wordClass },
  } = constants;

  return (
    <>
      <FieldHeader title={t("form.gloss.glossHeading")} />
      <FormikField name="gloss">
        {({ field }) => (
          <FieldSection>
            <StyledFormikField name={`${field.name}.gloss`}>
              {({ field }) => <Input placeholder={t("form.gloss.gloss")} type="text" value={field.value} {...field} />}
            </StyledFormikField>
            <StyledFormikField name={`${field.name}.wordClass`}>
              {({ field }) => (
                <Select label={t("form.gloss.wordClass")} value={field.value} {...field}>
                  {!field.value && (
                    <option>
                      {t("form.gloss.choose", {
                        label: t("form.gloss.wordClass").toLowerCase(),
                      })}
                    </option>
                  )}
                  {Object.entries(wordClass)?.map(([key, value]) => (
                    <option value={value} key={key}>
                      {t(`wordClass.${value}`)}
                    </option>
                  ))}
                </Select>
              )}
            </StyledFormikField>
            <StyledFormikField name={`${field.name}.originalLanguage`}>
              {({ field }) => (
                <Select value={field.value} {...field}>
                  {!field.value && (
                    <option>
                      {t("form.gloss.choose", {
                        label: t("form.gloss.originalLanguage").toLowerCase(),
                      })}
                    </option>
                  )}

                  {LANGUAGES.map((language, index) => (
                    <option value={language} key={index}>
                      {t(`languages.${language}`)}
                    </option>
                  ))}
                </Select>
              )}
            </StyledFormikField>
          </FieldSection>
        )}
      </FormikField>

      {value?.originalLanguage === "zh" && (
        <>
          <FieldHeader title={t("form.gloss.transcriptions")} />
          <TranscriptionsField name="transcriptions" />
        </>
      )}
      <FieldHeader title={t("form.gloss.examples")} />
      <ExamplesFieldArray name="examples" />
    </>
  );
};

export default GlossDataSection;
