import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { NotionDialog } from '@ndla/notion';
import { IConcept } from '@ndla/types-concept-api';
import { ReactNode, useEffect, useState } from 'react';
import { Editor } from 'slate';
import { RenderElementProps, useSelected } from 'slate-react';
import { ConceptInlineElement } from './interfaces';
import { Portal } from '../../../../Portal';
import Tooltip from '@ndla/tooltip';
import { PUBLISHED } from '../../../../../util/constants/ConceptStatus';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Check } from '@ndla/icons/lib/editor';
import SlateConceptPreview from '../SlateConceptPreview';
import { NotionDialogStyledWrapper } from '@ndla/notion/lib/NotionDialog';
import NotionHeader from '@ndla/notion/lib/NotionHeader';
import NotionBody from '@ndla/notion/lib/NotionBody';

const StyledCheckIcon = styled(Check)`
  margin-left: 10px;
  width: ${spacing.normal};
  height: ${spacing.normal};
  fill: ${colors.support.green};
`;

const StyledWarnIcon = styled(AlertCircle)`
  margin-left: 5px;
  height: ${spacing.normal};
  width: ${spacing.normal};
  fill: ${colors.brand.grey};
`;

const afterCSS = css`
  display: inline-block;
  position: absolute;
  margin: calc(1em + 4px) auto 0;
  left: 0;
  right: 0;
  width: 0;
  height: 0;
  top: 5px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid ${colors.brand.primary};
  transition: transform 0.1s ease;
`;

const NotionCSS = css`
  display: inline;
  background: none;
  border: none;
  font-family: inherit;
  font-style: inherit;
  line-height: 1em;
  padding: 0 0 4px 0;
  margin-bottom: -4px;
  text-decoration: none;
  color: #000;
  border-bottom: 1px solid ${colors.brand.tertiary};
  position: relative;
  cursor: pointer;
  &:hover,
  &:focus {
    border-color: ${colors.brand.primary};
    outline: none;
    &:after {
      transform: scale(1.4) translateY(1px);
    }
  }
`;

interface Props {
  element: ConceptInlineElement;
  locale: string;
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  concept?: IConcept;
  id: string;
  handleRemove: () => void;
  children: ReactNode;
}

const SlateNotion = ({
  children,
  element,
  locale,
  editor,
  attributes,
  id,
  concept,
  handleRemove,
}: Props) => {
  const { t } = useTranslation();

  return (
    <span data-notion id={id}>
      <span css={NotionCSS} data-notion-link {...attributes}>
        <div contentEditable={false} css={afterCSS} />
        <Portal isOpened>
          <NotionDialog
            title={concept?.title.title ?? ''}
            subTitle={t('conceptform.title')}
            id={id}
            customCSS={''}
            headerContent={
              <div
                css={css`
                  display: flex;
                  flex: 1;
                  flex-direction: inherit;
                `}>
                {(concept?.status.current === PUBLISHED ||
                  concept?.status.other.includes(PUBLISHED)) && (
                  <Tooltip
                    tooltip={t('form.workflow.published')}
                    css={css`
                      margin-right: auto;
                    `}>
                    <StyledCheckIcon />
                  </Tooltip>
                )}
                {concept?.status.current !== PUBLISHED && (
                  <Tooltip
                    tooltip={t('form.workflow.currentStatus', {
                      status: t(`form.status.${concept?.status.current.toLowerCase()}`),
                    })}>
                    <StyledWarnIcon />
                  </Tooltip>
                )}
              </div>
            }>
            {concept && (
              <SlateConceptPreview concept={concept} handleRemove={handleRemove} id={concept.id} />
            )}
          </NotionDialog>
        </Portal>
        {children}
      </span>
    </span>
  );
};

export default SlateNotion;
