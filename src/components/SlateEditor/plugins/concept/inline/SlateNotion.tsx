import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { NotionDialog } from '@ndla/notion';
import { IConcept } from '@ndla/types-concept-api';
import { ReactNode } from 'react';
import { RenderElementProps } from 'slate-react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { AlertCircle, Check } from '@ndla/icons/editor';
import { Portal } from '../../../../Portal';
import { PUBLISHED } from '../../../../../util/constants/ConceptStatus';
import InlineConceptPreview from './InlineConceptPreview';

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

const NotionArrow = styled.div`
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

const StyledNotionSpan = styled.span`
  display: inline;
  font-family: inherit;
  font-style: inherit;
  line-height: 1em;
  padding: 0 0 4px 0;
  margin-bottom: -4px;
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

const StyledDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: inherit;
`;

const StyledTooltip = styled(Tooltip)`
  margin-right: auto;
`;

interface Props {
  attributes: RenderElementProps['attributes'];
  concept?: IConcept;
  id: string;
  handleRemove: () => void;
  children: ReactNode;
}

const SlateNotion = ({ children, attributes, id, concept, handleRemove }: Props) => {
  const { t } = useTranslation();

  return (
    <span data-notion id={id}>
      <StyledNotionSpan data-notion-link {...attributes}>
        <NotionArrow contentEditable={false} />
        <Portal isOpened>
          <NotionDialog
            title={concept?.title.title ?? ''}
            subTitle={t('conceptform.title')}
            id={id}
            customCSS={''}
            headerContent={
              <StyledDiv>
                {(concept?.status.current === PUBLISHED ||
                  concept?.status.other.includes(PUBLISHED)) && (
                  <StyledTooltip tooltip={t('form.workflow.published')}>
                    <StyledCheckIcon />
                  </StyledTooltip>
                )}
                {concept?.status.current !== PUBLISHED && (
                  <Tooltip
                    tooltip={t('form.workflow.currentStatus', {
                      status: t(`form.status.${concept?.status.current.toLowerCase()}`),
                    })}>
                    <StyledWarnIcon />
                  </Tooltip>
                )}
              </StyledDiv>
            }>
            {concept && (
              <InlineConceptPreview concept={concept} handleRemove={handleRemove} id={concept.id} />
            )}
          </NotionDialog>
        </Portal>
        {children}
      </StyledNotionSpan>
    </span>
  );
};

export default SlateNotion;
