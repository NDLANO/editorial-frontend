import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { NotionDialog } from '@ndla/notion';
import { IConcept } from '@ndla/types-backend/concept-api';
import { ReactNode } from 'react';
import { RenderElementProps } from 'slate-react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { AlertCircle, Check } from '@ndla/icons/editor';
import { Portal } from '../../../../Portal';
import { PUBLISHED } from '../../../../../constants';
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

const StyledDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: inherit;
`;

const StyledTooltip = styled(Tooltip)`
  margin-right: auto;
`;

const BaselineIcon = styled.div`
  border-bottom: 5px double currentColor;
`;

const StyledButton = styled.button`
  background: none;
  border: none;
  font-family: inherit;
  font-style: inherit;
  line-height: 1em;
  padding: 0 0 4px 0;
  margin-bottom: -4px;
  text-decoration: none;
  position: relative;
  text-align: left;
  display: inline;
  color: ${colors.notion.dark};
  cursor: pointer;
  &:focus,
  &:hover {
    background-color: ${colors.notion.dark};
    color: ${colors.white};
    outline: none;
    ${BaselineIcon} {
      border-color: transparent;
    }
  }

  &:active {
    color: ${colors.notion.dark};
    background-color: ${colors.notion.light};
    ${BaselineIcon} {
      border-color: currentColor;
    }
  }
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
      <StyledButton
        type="button"
        aria-label={t('concept.showDescription', { title: concept?.title.title ?? '' })}
        {...attributes}
        data-notion-link
      >
        <div>
          {children}
          {<BaselineIcon />}
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
                      <div>
                        <StyledCheckIcon />
                      </div>
                    </StyledTooltip>
                  )}
                  {concept?.status.current !== PUBLISHED && (
                    <Tooltip
                      tooltip={t('form.workflow.currentStatus', {
                        status: t(`form.status.${concept?.status.current.toLowerCase()}`),
                      })}
                    >
                      <div>
                        <StyledWarnIcon />
                      </div>
                    </Tooltip>
                  )}
                </StyledDiv>
              }
            >
              {concept && (
                <InlineConceptPreview
                  concept={concept}
                  handleRemove={handleRemove}
                  id={concept.id}
                />
              )}
            </NotionDialog>
          </Portal>
        </div>
      </StyledButton>
    </span>
  );
};

export default SlateNotion;
