/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button, FieldsetHelper, FieldsetLegend, FieldsetRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GlossExampleDTO } from "@ndla/types-backend/concept-api";
import { FieldArray, useField } from "formik";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../components/FormField";
import { emptyGlossExample } from "../glossData";
import LanguageVariantFieldArray from "./LanguageVariantFieldArray";

const StyledFieldsetRoot = styled(FieldsetRoot, {
  base: {
    alignItems: "flex-start",
    width: "100%",
    gap: "xsmall",
  },
});

const ArrayWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "large",
    width: "100%",
  },
});

const StyledButton = styled(Button, {
  base: {
    marginBlockStart: "medium",
  },
});

interface Props {
  name: string;
}

const ExamplesFieldArray = ({ name }: Props) => {
  const [, { value }] = useField<GlossExampleDTO[][]>("examples");
  const [originalLanguageField] = useField("gloss.originalLanguage");
  const { t } = useTranslation();

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <StyledFieldsetRoot>
          <FieldsetLegend textStyle="title.medium">{t("form.gloss.examples.title")}</FieldsetLegend>
          <FieldsetHelper>{t("form.gloss.examples.description")}</FieldsetHelper>
          <ArrayWrapper>
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
          </ArrayWrapper>
          <StyledButton
            disabled={!originalLanguageField.value}
            onClick={() => {
              arrayHelpers.push([emptyGlossExample]);
            }}
          >
            {t("form.gloss.add", {
              label: t(`form.gloss.example`).toLowerCase(),
            })}
          </StyledButton>
        </StyledFieldsetRoot>
      )}
    />
  );
};

export default ExamplesFieldArray;
