/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, ReactNode, useCallback } from 'react';
import { Editor, Element, Transforms, Path } from 'slate';
import { useTranslation } from 'react-i18next';
import { ReactEditor, RenderElementProps, useSelected } from 'slate-react';
import styled from '@emotion/styled';
import { IConcept, IConceptSummary } from '@ndla/types-backend/concept-api';
import { ConceptEmbedData } from '@ndla/types-embed';
import { Modal, ModalContent } from '@ndla/modal';
import { spacing, colors } from '@ndla/core';
import { Check, AlertCircle, DeleteForever } from '@ndla/icons/editor';
import { IconButtonV2 } from '@ndla/button';
import { Link as LinkIcon } from '@ndla/icons/common';
import { SafeLinkIconButton } from '@ndla/safelink';
import Tooltip from '@ndla/tooltip';
import { useFetchConceptData } from '../../../../../containers/FormikForm/formikConceptHooks';
import { TYPE_CONCEPT_BLOCK, TYPE_GLOSS_BLOCK } from './types';
import { ConceptBlockElement } from './interfaces';
import ConceptModalContent from '../ConceptModalContent';
import SlateBlockConcept from './SlateBlockConcept';
import SlateBlockGloss from './SlateBlockGloss';
import { PUBLISHED } from '../../../../../constants';

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
  white-space: normal;
  ul {
    margin-top: 0;
  }
  padding: ${spacing.xsmall};

  border: 2px dashed ${colors.brand.greyLighter};

  &[data-solid-border='true'] {
    border: 2px solid ${colors.brand.primary};
  }
`;
const StyledCheckIcon = styled(Check)`
  margin-left: ${spacing.xsmall};
  width: ${spacing.normal};
  height: ${spacing.normal};
  fill: ${colors.support.green};
`;

const StyledAlertCircle = styled(AlertCircle)`
  margin-left: ${spacing.xsmall};
  margin-top: ${spacing.xsmall};
  height: ${spacing.normal};
  width: ${spacing.normal};
  fill: ${colors.brand.grey};
`;

const ButtonContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  right: -${spacing.large};
`;

const BlockWrapper = ({ element, locale, editor, attributes, children }: Props) => {
  const isSelected = useSelected();
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const { concept, subjects, ...conceptHooks } = useFetchConceptData(
    parseInt(element.data.contentId),
    locale,
  );

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
      <StyledWrapper
        {...attributes}
        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
        tabIndex={1}
        data-solid-border={isSelected}
        draggable={true}
        className="c-figure u-float"
      >
        {concept && (
          <div contentEditable={false}>
            <ConceptButtonContainer concept={concept} handleRemove={handleRemove} />
            {concept?.conceptType === 'concept' && <SlateBlockConcept concept={concept} />}
            {concept?.conceptType === 'gloss' && <SlateBlockGloss concept={concept} />}
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
}

const ConceptButtonContainer = ({ concept, handleRemove }: ButtonContainerProps) => {
  const { t, i18n } = useTranslation();
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
        to={`/${concept.conceptType}/${concept.id}/edit/${
          concept.content?.language ?? i18n.language
        }`}
        target="_blank"
      >
        <LinkIcon />
      </SafeLinkIconButton>
      {(concept?.status.current === PUBLISHED || concept?.status.other.includes(PUBLISHED)) && (
        <Tooltip tooltip={t('form.workflow.published')}>
          <div>
            <StyledCheckIcon />
          </div>
        </Tooltip>
      )}
      {concept?.status.current !== PUBLISHED && (
        <Tooltip
          tooltip={t('form.workflow.currentStatus', {
            status: t(`form.status.${concept?.status.current.toLowerCase()}`),
          })}
        >
          <div>
            <StyledAlertCircle />
          </div>
        </Tooltip>
      )}
    </ButtonContainer>
  );
};

export default BlockWrapper;
