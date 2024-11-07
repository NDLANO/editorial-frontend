/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { DeleteBinLine } from "@ndla/icons/action";
import {
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  FieldsetLegend,
  FieldsetRoot,
  IconButton,
  SelectContent,
  SelectHiddenSelect,
  SelectLabel,
  SelectPositioner,
  SelectRoot,
  SelectValueText,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IGlossExample } from "@ndla/types-backend/concept-api";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";
import { FormField } from "../../../components/FormField";
import { LANGUAGES } from "../glossData";

interface Props {
  example: IGlossExample;
  name: string;
  index: number;
  exampleIndex: number;
  onRemoveExample: () => void;
}

const FieldWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

const StyledFieldsetRoot = styled(FieldsetRoot, {
  base: {
    width: "100%",
  },
});

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    width: "100%",
  },
});

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    width: "surface.xxsmall",
  },
});

const ExampleField = ({ example, name, index, exampleIndex, onRemoveExample }: Props) => {
  const { t } = useTranslation();
  const labelIndex = index + 1;
  const [languageField, languageMeta, languageHelpers] = useField(`${name}.language`);
  const [originalLanguageField] = useField("gloss.originalLanguage");

  const removeLabel = t("form.gloss.examples.removeLanguageVariant", {
    language: t(`languages.${example.language}`).toLowerCase(),
    index: exampleIndex + 1,
  });

  const collection = useMemo(
    () =>
      createListCollection({
        items: LANGUAGES,
        itemToString: (item) => t(`languages.${item}`),
        itemToValue: (item) => item,
      }),
    [t],
  );

  useEffect(() => {
    if (exampleIndex === 0) {
      languageHelpers.setValue(originalLanguageField.value, true);
    } else if (!languageField.value) {
      languageHelpers.setValue("nb", true);
    }
  }, [exampleIndex, languageField.value, languageHelpers, originalLanguageField.value]);

  return (
    <StyledFieldsetRoot>
      <FieldsetLegend textStyle="label.small">
        {t("form.gloss.examples.exampleOnLanguage", {
          index: labelIndex,
          language: t(`languages.${languageField.value}`).toLowerCase(),
        })}
      </FieldsetLegend>
      <FieldWrapper>
        <FormField name={`${name}.example`}>
          {({ field, meta }) => (
            <StyledFieldRoot required invalid={!!meta.error}>
              <FieldLabel srOnly>
                {t("form.gloss.examples.exampleTextLabel", {
                  index: labelIndex,
                  language: t(`languages.${languageField.value}`).toLowerCase(),
                })}
              </FieldLabel>
              <FieldInput type="text" placeholder={t("form.gloss.example")} {...field} />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </StyledFieldRoot>
          )}
        </FormField>
        {exampleIndex !== 0 && (
          <FieldRoot required invalid={!!languageMeta.error}>
            <SelectRoot
              collection={collection}
              positioning={{ sameWidth: true }}
              value={[languageField.value]}
              onValueChange={(details) => languageHelpers.setValue(details.value[0])}
            >
              <SelectLabel srOnly>{t("form.gloss.language")}</SelectLabel>
              <FieldErrorMessage>{languageMeta.error}</FieldErrorMessage>
              <StyledGenericSelectTrigger>
                <SelectValueText
                  placeholder={t("form.gloss.choose", { label: t("form.gloss.language").toLowerCase() })}
                />
              </StyledGenericSelectTrigger>
              <SelectPositioner>
                <SelectContent>
                  {collection.items.map((language) => (
                    <GenericSelectItem key={language} item={language}>
                      {t(`languages.${language}`)}
                    </GenericSelectItem>
                  ))}
                </SelectContent>
              </SelectPositioner>
              <SelectHiddenSelect />
            </SelectRoot>
          </FieldRoot>
        )}
        <IconButton variant="danger" aria-label={removeLabel} title={removeLabel} onClick={onRemoveExample}>
          <DeleteBinLine />
        </IconButton>
      </FieldWrapper>
    </StyledFieldsetRoot>
  );
};

export default ExampleField;
