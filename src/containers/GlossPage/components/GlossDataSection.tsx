/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import {
  FieldErrorMessage,
  FieldHelper,
  FieldInput,
  FieldLabel,
  FieldRoot,
  Heading,
  SelectContent,
  SelectHiddenSelect,
  SelectLabel,
  SelectRoot,
  SelectValueText,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { constants } from "@ndla/ui";
import ExamplesFieldArray from "./ExamplesFieldArray";
import { GlossAudioField } from "./GlossAudioField";
import TranscriptionsField from "./TranscriptionsField";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";
import { FormField } from "../../../components/FormField";
import { FormContent } from "../../../components/FormikForm";
import { LANGUAGES } from "../glossData";

const {
  wordClass: { wordClass },
} = constants;

const FieldWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

const StyledFormContent = styled(FormContent, {
  base: {
    alignItems: "flex-start",
  },
});

interface Props {
  glossLanguage: string;
}

const GlossDataSection = ({ glossLanguage }: Props) => {
  const { t } = useTranslation();

  const languageCollection = useMemo(() => {
    return createListCollection({
      items: LANGUAGES,
      itemToString: (item) => t(`languages.${item}`),
      itemToValue: (item) => item,
    });
  }, [t]);

  const wordClassCollection = useMemo(() => {
    return createListCollection({
      items: Object.entries(wordClass).map(([, value]) => value),
      itemToString: (item) => t(`wordClass.${item}`),
      itemToValue: (item) => item,
    });
  }, [t]);

  return (
    <StyledFormContent>
      <Heading asChild consumeCss textStyle="title.medium">
        <h3>{t("form.gloss.glossHeading")}</h3>
      </Heading>
      <FieldWrapper>
        <FormField name="gloss.originalLanguage">
          {({ field, meta, helpers }) => (
            <FieldRoot required invalid={!!meta.error}>
              <SelectRoot
                collection={languageCollection}
                value={[field.value]}
                onValueChange={(details) => helpers.setValue(details.value[0])}
                positioning={{ sameWidth: true }}
              >
                <SelectLabel>{t("form.gloss.originalLanguage")}</SelectLabel>
                <GenericSelectTrigger>
                  <SelectValueText placeholder={t("form.gloss.choose", { label: t("form.gloss.originalLanguage") })} />
                </GenericSelectTrigger>
                <SelectContent>
                  {languageCollection.items.map((language) => (
                    <GenericSelectItem key={language} item={language}>
                      {t(`languages.${language}`)}
                    </GenericSelectItem>
                  ))}
                </SelectContent>
                <SelectHiddenSelect />
              </SelectRoot>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </FieldRoot>
          )}
        </FormField>
        <FormField name="gloss.wordClass">
          {({ field, meta, helpers }) => (
            <FieldRoot required invalid={!!meta.error}>
              <SelectRoot
                collection={wordClassCollection}
                value={field.value}
                multiple
                onValueChange={(details) => helpers.setValue(details.value)}
                positioning={{ sameWidth: true }}
              >
                <SelectLabel>{t("form.gloss.wordClass")}</SelectLabel>
                <GenericSelectTrigger>
                  <SelectValueText placeholder={t("form.gloss.choose", { label: t("form.gloss.wordClass") })} />
                </GenericSelectTrigger>
                <SelectContent>
                  {wordClassCollection.items.map((wordClass) => (
                    <GenericSelectItem key={wordClass} item={wordClass}>
                      {t(`wordClass.${wordClass}`)}
                    </GenericSelectItem>
                  ))}
                </SelectContent>
                <SelectHiddenSelect />
              </SelectRoot>
            </FieldRoot>
          )}
        </FormField>
      </FieldWrapper>
      <FormField name="gloss.gloss">
        {({ field, meta }) => (
          <FieldRoot required invalid={!!meta.error}>
            <FieldLabel>{t("form.gloss.gloss")}</FieldLabel>
            <FieldInput {...field} placeholder={t("form.gloss.gloss")} type="text" />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
      <TranscriptionsField name="transcriptions" />
      <FormField name="visualElement">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <Text textStyle="label.medium" fontWeight="bold">
              {t("form.name.audioFile")}
            </Text>
            <FieldHelper>{t("form.gloss.audio.helperText")}</FieldHelper>
            <GlossAudioField
              glossLanguage={glossLanguage}
              element={field.value[0]?.data}
              onElementChange={(data) => {
                field.onChange({
                  target: {
                    name: "visualElement",
                    value: [{ children: [{ text: "" }], data, type: "audio" }],
                  },
                });
              }}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
      <ExamplesFieldArray name="examples" />
    </StyledFormContent>
  );
};

export default GlossDataSection;
