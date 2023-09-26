import styled from '@emotion/styled';
import { Portal } from '@radix-ui/react-portal';
import { colors, spacing } from '@ndla/core';
import { NotionDialog } from '@ndla/notion';
import { IConcept } from '@ndla/types-backend/concept-api';
import { ReactNode } from 'react';
import { RenderElementProps } from 'slate-react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { Check, DeleteForever, Warning } from '@ndla/icons/editor';
import { SafeLinkIconButton } from '@ndla/safelink';
import { IconButtonV2 } from '@ndla/button';
import { css } from '@emotion/react';
import { Link as LinkIcon } from '@ndla/icons/common';
import { PUBLISHED } from '../../../../../constants';
import SlateInlineConcept from './SlateInlineConcept';
import SlateInlineGloss from './SlateInlineGloss';

const StyledDeleteForever = styled(DeleteForever)`
  color: ${colors.support.red};

  &:hover {
    color: ${colors.white};
  }
`;

const StyledCheckIcon = styled(Check)`
  margin-left: ${spacing.xsmall};
  width: ${spacing.normal};
  height: ${spacing.normal};
  fill: ${colors.support.green};
`;

const StyledDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: inherit;
  gap: ${spacing.xxsmall};
  padding-left: ${spacing.xxsmall};
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

const ButtonCSS = css`
  padding: unset;
  margin-right: ${spacing.xsmall};
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
          <Portal>
            <NotionDialog
              title={concept?.title.title ?? ''}
              subTitle={t(`conceptform.${concept?.conceptType}`)}
              id={id}
              headerContent={
                <>
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
                        })}
                      >
                        <Warning />
                      </Tooltip>
                    )}
                  </StyledDiv>
                  <IconButtonV2
                    colorTheme="danger"
                    variant="ghost"
                    onClick={handleRemove}
                    tabIndex={-1}
                    aria-label={t('form.concept.removeConcept')}
                    css={ButtonCSS}
                  >
                    <StyledDeleteForever />
                  </IconButtonV2>
                  <SafeLinkIconButton
                    to={`/concept/${concept?.id}/edit/${concept?.content?.language}`}
                    target="_blank"
                    tabIndex={-1}
                    colorTheme="lighter"
                    variant="ghost"
                    aria-label={t('form.concept.edit')}
                    css={ButtonCSS}
                  >
                    <LinkIcon />
                  </SafeLinkIconButton>
                </>
              }
            >
              {concept?.conceptType === 'concept' && <SlateInlineConcept concept={concept} />}
              {concept?.conceptType === 'gloss' && <SlateInlineGloss concept={concept} />}
            </NotionDialog>
          </Portal>
        </div>
      </StyledButton>
    </span>
  );
};

export default SlateNotion;
