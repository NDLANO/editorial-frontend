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
import styled from "@emotion/styled";
import { fonts, spacing } from "@ndla/core";
import { CheckboxItem, Label } from "@ndla/forms";
import { Cross } from "@ndla/icons/action";
import { Button, DialogBody, DialogCloseTrigger, DialogHeader, DialogTitle, IconButton } from "@ndla/primitives";
import { IGlossExample } from "@ndla/types-backend/concept-api";
import { ConceptMetaData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import { GlossExample } from "@ndla/ui";
import { ConceptBlockElement } from "./block/interfaces";
import { ConceptInlineElement } from "./inline/interfaces";
import { generateNumbersArray, generateUniqueGlossLanguageArray } from "./utils";
import { CheckboxWrapper } from "../../../Form/styles";
import { FormControl } from "../../../FormField";

const ButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  justify-content: flex-end;
`;

const CheckboxGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${spacing.small};
  & label {
    font-weight: ${fonts.weight.semibold};
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const StyledCheckboxWrapper = styled.div`
  margin-top: ${spacing.small};
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

interface Props {
  originalLanguage: string | undefined;
  examples: IGlossExample[][];
  editor: Editor;
  element: ConceptBlockElement | ConceptInlineElement;
  embed: ConceptMetaData;
  close: () => void;
}

const onCheckboxChange = (value: string, updateFunction: (val: string[]) => void, selectedElements: string[]): void => {
  const updatedSelectedExamples = selectedElements.includes(value)
    ? selectedElements.filter((el) => el !== value)
    : [...selectedElements, value];

  updateFunction(updatedSelectedExamples);
};

const getInitialStateSelectedExamples = (exampleIds: string | undefined, examples: IGlossExample[][]): string[] => {
  if (exampleIds) return exampleIds.split(",");
  else if (exampleIds === undefined) return generateNumbersArray(examples.length);
  else return [];
};

const EditGlossExamplesModalContent = ({ originalLanguage, examples, editor, element, embed, close }: Props) => {
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
            <Cross />
          </IconButton>
        </DialogCloseTrigger>
      </DialogHeader>
      <DialogBody>
        <StyledForm>
          <FlexWrapper>
            {examples.map((glossExample, index) => {
              const filtered = glossExample.filter((e) => selectedLanguages.includes(e.language));
              return (
                <div key={`edit-gloss-example-${index}`}>
                  <div>
                    <GlossExample examples={filtered} originalLanguage={originalLanguage} />
                  </div>

                  <StyledCheckboxWrapper>
                    <FormControl>
                      <CheckboxWrapper>
                        <CheckboxItem
                          checked={selectedExamples.includes(index.toString())}
                          onCheckedChange={() =>
                            onCheckboxChange(index.toString(), setSelectedExamples, selectedExamples)
                          }
                          disabled={selectedLanguages.length === 0}
                        />
                        <Label margin="none" textStyle="label-small">
                          {t("form.gloss.displayOnGloss")}
                        </Label>
                      </CheckboxWrapper>
                    </FormControl>
                  </StyledCheckboxWrapper>
                </div>
              );
            })}
          </FlexWrapper>
          <div>
            <Text textStyle="label-large" margin="none">
              {t("form.name.language")}
            </Text>
            <Text textStyle="content-alt" margin="none">
              {t("form.gloss.editExamplesLanguage")}
            </Text>
            <CheckboxGroupWrapper>
              {languages.map((lang, index) => (
                <FormControl key={lang}>
                  <CheckboxWrapper>
                    <CheckboxItem
                      checked={selectedLanguages.includes(lang)}
                      onCheckedChange={() =>
                        onCheckboxChange(languages[index], setSelectedLanguages, selectedLanguages)
                      }
                    />
                    <Label margin="none" textStyle="label-small">
                      {t(`languages.${lang}`)}
                    </Label>
                  </CheckboxWrapper>
                </FormControl>
              ))}
            </CheckboxGroupWrapper>
          </div>
          <ButtonWrapper>
            <Button onClick={close} variant="secondary">
              {t("form.abort")}
            </Button>
            <Button onClick={saveGlossUpdates}>{t("form.save")}</Button>
          </ButtonWrapper>
        </StyledForm>
      </DialogBody>
    </>
  );
};

export default EditGlossExamplesModalContent;
