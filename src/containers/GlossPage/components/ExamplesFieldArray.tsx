/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldArray, useField } from "formik";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { IGlossExample } from "@ndla/types-backend/concept-api";
import { Text } from "@ndla/typography";

import LanguageVariantFieldArray from "./LanguageVariantFieldArray";
import { FormField } from "../../../components/FormField";
import { emptyGlossExample } from "../glossData";

const StyledFieldset = styled.fieldset`
  border: none;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: ${spacing.small};
  width: 100%;
  padding: 0px;
`;

interface Props {
  name: string;
}

const ExamplesFieldArray = ({ name }: Props) => {
  const [_, { value }] = useField<IGlossExample[][]>("examples");
  const [originalLanguageField] = useField("gloss.originalLanguage");
  const { t } = useTranslation();

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <StyledFieldset>
          <Text element="legend" textStyle="label-large">
            {t("form.gloss.examples.title")}
          </Text>
          <Text textStyle="meta-text-medium">{t("form.gloss.examples.description")}</Text>
          {value?.map((languageVariantExamples, index) => (
            <FormField key={`${name}.${index}`} name={`${name}.${index}`}>
              {({ field }) => (
                <LanguageVariantFieldArray
                  examples={languageVariantExamples}
                  index={index}
                  {...field}
                  removeFromParentArray={() => arrayHelpers.remove(index)}
                />
              )}
            </FormField>
          ))}
          <ButtonV2
            disabled={!originalLanguageField.value}
            onClick={() => {
              arrayHelpers.push([emptyGlossExample]);
            }}
          >
            {t("form.gloss.add", {
              label: t(`form.gloss.example`).toLowerCase(),
            })}
          </ButtonV2>
        </StyledFieldset>
      )}
    />
  );
};

export default ExamplesFieldArray;
