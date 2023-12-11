/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, ReactNode, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Element, Transforms, Path } from 'slate';
import { ReactEditor, RenderElementProps, useSelected } from 'slate-react';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { spacing, colors } from '@ndla/core';
import { Link as LinkIcon } from '@ndla/icons/common';
import { Check, AlertCircle, DeleteForever } from '@ndla/icons/editor';
import { Modal, ModalContent } from '@ndla/modal';
import { SafeLinkIconButton } from '@ndla/safelink';
import { IConcept, IConceptSummary } from '@ndla/types-backend/concept-api';
import { ConceptEmbedData, ConceptMetaData } from '@ndla/types-embed';
import { ConceptEmbed } from '@ndla/ui';
import { ConceptBlockElement } from './interfaces';
import { TYPE_CONCEPT_BLOCK, TYPE_GLOSS_BLOCK } from './types';
import { PUBLISHED } from '../../../../../constants';
import { useFetchConceptData } from '../../../../../containers/FormikForm/formikConceptHooks';
import { useConceptVisualElement } from '../../../../../modules/embed/queries';
import parseMarkdown from '../../../../../util/parseMarkdown';
import ConceptModalContent from '../ConceptModalContent';

const getConceptDataAttributes = ({ id }: IConceptSummary | IConcept): ConceptEmbedData => ({
  contentId: id.toString(),
  resource: 'concept',
  type: 'block',
  linkText: '',
});

interface Props {
  element: ConceptBlockElement;
  locale: string;
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
}

const StyledWrapper = styled.div`
  position: relative;
  &[data-solid-border='true'] {
    outline: 2px solid ${colors.brand.primary};
  }
`;

const BlockWrapper = ({ element, locale, editor, attributes, children }: Props) => {
  const isSelected = useSelected();
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const { concept, subjects, loading, ...conceptHooks } = useFetchConceptData(
    parseInt(element.data.contentId),
    locale,
  );

  const visualElementQuery = useConceptVisualElement(
    concept?.id!,
    concept?.visualElement?.visualElement!,
    locale,
    {
      enabled: !!concept?.id && !!concept?.visualElement?.visualElement.length,
    },
  );

  const embed: ConceptMetaData | undefined = useMemo(() => {
    if (!element.data || !concept) return undefined;
    return {
      status: !concept && !loading ? 'error' : 'success',
      data: {
        concept: {
          ...concept,
          content: concept.content
            ? { ...concept.content, content: parseMarkdown({ markdown: concept.content.content }) }
            : undefined,
        },
        visualElement: visualElementQuery.data,
      },
      embedData: element.data,
      resource: 'concept',
    };
  }, [element.data, concept, loading, visualElementQuery.data]);

  const addConcept = useCallback(
    (addedConcept: IConceptSummary | IConcept) => {
      setIsEditing(false);
      const data = getConceptDataAttributes(addedConcept);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        { data },
        {
          at: path,
          match: (node) =>
            Element.isElement(node) &&
            (node.type === TYPE_CONCEPT_BLOCK || node.type === TYPE_GLOSS_BLOCK),
        },
      );
    },
    [setIsEditing, editor, element],
  );

  const handleRemove = useCallback(
    () =>
      Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true }),
    [editor, element],
  );

  const onClose = useCallback(() => {
    ReactEditor.focus(editor);
    setIsEditing(false);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
    }
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  }, [editor, element]);

  return (
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <StyledWrapper {...attributes} data-solid-border={isSelected} draggable={true}>
        {concept && embed && (
          <div contentEditable={false}>
            <ConceptButtonContainer
              concept={concept}
              handleRemove={handleRemove}
              language={locale}
            />
            <ConceptEmbed embed={embed} />
          </div>
        )}
        <ModalContent size={{ width: 'large', height: 'large' }}>
          <ConceptModalContent
            onClose={onClose}
            addConcept={addConcept}
            locale={locale}
            concept={concept}
            subjects={subjects}
            handleRemove={handleRemove}
            conceptType={element.type === 'gloss-block' ? 'gloss' : 'concept'}
            {...conceptHooks}
          />
        </ModalContent>
        {children}
      </StyledWrapper>
    </Modal>
  );
};

interface ButtonContainerProps {
  concept: IConcept | IConceptSummary;
  handleRemove: () => void;
  language: string;
}

const ButtonContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.xsmall};
  right: -${spacing.large};
`;

const IconWrapper = styled.div`
  svg {
    height: ${spacing.normal};
    width: ${spacing.normal};
    fill: ${colors.brand.grey};
  }
  &[data-color='green'] {
    svg {
      fill: ${colors.support.green};
    }
  }
  &[data-color='red'] {
    svg {
      fill: ${colors.support.red};
    }
  }
`;

const ConceptButtonContainer = ({ concept, handleRemove, language }: ButtonContainerProps) => {
  const { t } = useTranslation();
  const translatedCurrent = t(`form.status.${concept?.status.current?.toLowerCase()}`);
  return (
    <ButtonContainer>
      <IconButtonV2
        title={t(`form.${concept?.conceptType}.remove`)}
        aria-label={t(`form.${concept?.conceptType}.remove`)}
        variant="ghost"
        colorTheme="danger"
        onClick={handleRemove}
      >
        <DeleteForever />
      </IconButtonV2>
      <SafeLinkIconButton
        arial-label={t(`form.${concept?.conceptType}.edit`)}
        title={t(`form.${concept?.conceptType}.edit`)}
        variant="ghost"
        colorTheme="light"
        to={`/${concept.conceptType}/${concept.id}/edit/${language}`}
        target="_blank"
      >
        <LinkIcon />
      </SafeLinkIconButton>
      {(concept?.status.current === PUBLISHED || concept?.status.other.includes(PUBLISHED)) && (
        <IconWrapper
          aria-label={t('form.workflow.published')}
          title={t('form.workflow.published')}
          data-color="green"
        >
          <Check />
        </IconWrapper>
      )}
      {concept?.status.current !== PUBLISHED && (
        <IconWrapper
          aria-label={t('form.workflow.currentStatus', { status: translatedCurrent })}
          title={t('form.workflow.currentStatus', { status: translatedCurrent })}
          data-color="red"
        >
          <AlertCircle />
        </IconWrapper>
      )}
    </ButtonContainer>
  );
};

export default BlockWrapper;
