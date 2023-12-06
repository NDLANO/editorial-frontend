/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ConceptMetaData } from '@ndla/types-embed';
import { ModalBody, ModalCloseButton, ModalHeader, ModalTitle } from '@ndla/modal';
import { IGlossExample } from '@ndla/types-backend/concept-api';
import { useTranslation } from 'react-i18next';
import { Text } from '@ndla/typography';
import styled from '@emotion/styled';
import { fonts, colors, spacing } from '@ndla/core';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { ButtonV2 } from '@ndla/button';
import { CheckboxItem } from '@ndla/forms';
import { useMemo, useState } from 'react';
import uniq from 'lodash/uniq';
import { ConceptBlockElement } from './block/interfaces';

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

const GlossExample = styled.div`
  padding: ${spacing.small} 0;
  padding-left: ${spacing.normal};
  border: 1px solid ${colors.brand.lighter};
  &:last-of-type {
    border-bottom: 1px solid ${colors.brand.lighter};
    margin-bottom: ${spacing.xsmall};
  }
  &:not(:last-of-type) {
    border-bottom: none;
  }
  &[data-is-first='true'] {
    background-color: ${colors.background.lightBlue};
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const StyledText = styled(Text)`
  &[data-is-first='true'] {
    font-weight: ${fonts.weight.semibold};
    color: ${colors.brand.dark};
  }
`;

const StyledCheckboxWrapper = styled.div`
  & label {
    font-weight: ${fonts.weight.semibold};
  }
`;

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

interface Props {
  examples: IGlossExample[][];
  editor: Editor;
  element: ConceptBlockElement;
  embed: ConceptMetaData;
  close: () => void;
}

const onCheckboxChange = (
  value: string,
  updateFunction: (val: string[]) => void,
  selectedElements: string[],
): void => {
  const updatedSelectedExamples = selectedElements.includes(value)
    ? selectedElements.filter((el) => el !== value)
    : [...selectedElements, value];

  updateFunction(updatedSelectedExamples);
};

const EditGlossExamplesModalContent = ({ examples, editor, element, embed, close }: Props) => {
  const { t } = useTranslation();
  const [selectedExamples, setSelectedExamples] = useState<string[]>(
    embed.embedData.exampleIds ? embed.embedData.exampleIds.split(',') : [],
  );

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    embed.embedData.exampleLangs?.split(',') ?? [],
  );

  const languages = useMemo(
    () => uniq(examples.flat().map((exampleTranslation) => exampleTranslation.language)),
    [examples],
  );

  const saveGlossUpdates = () => {
    Transforms.setNodes(
      editor,
      {
        data: {
          ...element.data,
          ...{
            ...embed.embedData,
            exampleIds: selectedExamples.length ? selectedExamples.join(',') : '',
            exampleLangs: selectedLanguages.length ? selectedLanguages.join(',') : '',
          },
        },
      },
      { at: ReactEditor.findPath(editor, element) },
    );
    close();
  };

  return (
    <>
      <ModalHeader>
        <ModalTitle>{t('form.gloss.editExamplesHeading')}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <StyledModalBody>
        <FlexWrapper>
          {examples.map((glossExample, outerIndex) => (
            <div key={`gloss-${outerIndex}`}>
              <div>
                {glossExample.map((example, index) => (
                  <GlossExample data-is-first={index === 0} key={`gloss-${outerIndex}-${index}`}>
                    <StyledText
                      data-is-first={index === 0}
                      textStyle="meta-text-medium"
                      margin="none"
                    >
                      {example.example}
                    </StyledText>
                  </GlossExample>
                ))}
              </div>
              <StyledCheckboxWrapper>
                <CheckboxItem
                  label={t('form.gloss.displayOnGloss')}
                  checked={selectedExamples.includes(outerIndex.toString())}
                  id={outerIndex}
                  onChange={(v) => {
                    if (v === undefined) return;
                    onCheckboxChange(v.toString(), setSelectedExamples, selectedExamples);
                  }}
                />
              </StyledCheckboxWrapper>
            </div>
          ))}
        </FlexWrapper>
        <div>
          <Text textStyle="label-large" margin="none">
            {t('form.name.language')}
          </Text>
          <Text textStyle="content-alt" margin="none">
            {t('form.gloss.editExamplesLanguage')}
          </Text>
          <CheckboxGroupWrapper>
            {languages.map((lang, index) => (
              <CheckboxItem
                label={t(`languages.${lang}`)}
                checked={selectedLanguages.includes(lang)}
                id={index}
                key={lang}
                onChange={(v) => {
                  if (v === undefined) return;
                  onCheckboxChange(languages[v], setSelectedLanguages, selectedLanguages);
                }}
              />
            ))}
          </CheckboxGroupWrapper>
        </div>
        <ButtonWrapper>
          <ButtonV2 onClick={close} variant="outline">
            {t('form.abort')}
          </ButtonV2>
          <ButtonV2 onClick={saveGlossUpdates}>{t('form.save')}</ButtonV2>
        </ButtonWrapper>
      </StyledModalBody>
    </>
  );
};

export default EditGlossExamplesModalContent;
