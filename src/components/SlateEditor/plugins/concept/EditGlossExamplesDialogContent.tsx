/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { CloseLine, CheckLine } from "@ndla/icons";
import {
  Button,
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  FieldHelper,
  FieldRoot,
  FieldsetLegend,
  FieldsetRoot,
  IconButton,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GlossExampleDTO } from "@ndla/types-backend/concept-api";
import { ConceptMetaData } from "@ndla/types-embed";
import { GlossExample } from "@ndla/ui";
import { ConceptBlockElement } from "./block/types";
import { ConceptInlineElement } from "./inline/types";
import { generateNumbersArray, generateUniqueGlossLanguageArray } from "./utils";
import { Form, FormActionsContainer } from "../../../FormikForm";

interface Props {
  originalLanguage: string | undefined;
  examples: GlossExampleDTO[][];
  editor: Editor;
  element: ConceptBlockElement | ConceptInlineElement;
  embed: ConceptMetaData;
  close: () => void;
}

const StyledCheckboxRoot = styled(CheckboxRoot, {
  base: {
    width: "fit-content",
  },
});

const getInitialStateSelectedExamples = (exampleIds: string | undefined, examples: GlossExampleDTO[][]): string[] => {
  if (exampleIds) return exampleIds.split(",");
  else if (exampleIds === undefined) return generateNumbersArray(examples.length);
  else return [];
};

const EditGlossExamplesDialogContent = ({ originalLanguage, examples, editor, element, embed, close }: Props) => {
  const { t } = useTranslation();
  const languages = generateUniqueGlossLanguageArray(examples);
  const [selectedExamples, setSelectedExamples] = useState<string[]>(
    getInitialStateSelectedExamples(embed.embedData.exampleIds, examples),
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    embed.embedData.exampleLangs?.split(",") ?? languages,
  );

  const saveGlossUpdates = () => {
    Transforms.setNodes(
      editor,
      {
        data: {
          ...element.data,
          ...{
            ...embed.embedData,
            exampleIds: selectedExamples.length ? selectedExamples.join(",") : "",
            exampleLangs: selectedLanguages.length ? selectedLanguages.join(",") : "",
          },
        },
      },
      { at: ReactEditor.findPath(editor, element) },
    );
    close();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("form.gloss.editExamplesHeading")}</DialogTitle>
        <DialogCloseTrigger asChild>
          <IconButton variant="clear" title={t("form.close")} aria-label={t("form.close")}>
            <CloseLine />
          </IconButton>
        </DialogCloseTrigger>
      </DialogHeader>
      <DialogBody>
        <Form>
          {examples.map((glossExample, index) => {
            const filtered = glossExample.filter((e) => selectedLanguages.includes(e.language));
            return (
              <div key={`edit-gloss-example-${index}`}>
                <GlossExample examples={filtered} originalLanguage={originalLanguage} />
                <FieldRoot>
                  <StyledCheckboxRoot
                    disabled={filtered.length === 0}
                    checked={filtered.length === 0 ? false : selectedExamples.includes(index.toString())}
                    onCheckedChange={() => {
                      setSelectedExamples((prev) =>
                        prev.includes(index.toString())
                          ? prev.filter((el) => el !== index.toString())
                          : [...prev, index.toString()],
                      );
                    }}
                  >
                    <CheckboxControl>
                      <CheckboxIndicator asChild>
                        <CheckLine />
                      </CheckboxIndicator>
                    </CheckboxControl>
                    <CheckboxLabel>{t("form.gloss.displayOnGloss")}</CheckboxLabel>
                    <CheckboxHiddenInput />
                  </StyledCheckboxRoot>
                </FieldRoot>
              </div>
            );
          })}
          <FieldsetRoot asChild>
            <CheckboxGroup value={selectedLanguages} onValueChange={setSelectedLanguages}>
              <FieldsetLegend>{t("form.name.language")}</FieldsetLegend>
              <FieldHelper>{t("form.gloss.editExamplesLanguage")}</FieldHelper>
              {languages.map((lang) => (
                <StyledCheckboxRoot key={lang} value={lang}>
                  <CheckboxControl>
                    <CheckboxIndicator asChild>
                      <CheckLine />
                    </CheckboxIndicator>
                  </CheckboxControl>
                  <CheckboxLabel>{t(`languages.${lang}`)}</CheckboxLabel>
                  <CheckboxHiddenInput />
                </StyledCheckboxRoot>
              ))}
            </CheckboxGroup>
          </FieldsetRoot>
          <FormActionsContainer>
            <Button onClick={close} variant="secondary">
              {t("form.abort")}
            </Button>
            <Button onClick={saveGlossUpdates}>{t("form.save")}</Button>
          </FormActionsContainer>
        </Form>
      </DialogBody>
    </>
  );
};

export default EditGlossExamplesDialogContent;
