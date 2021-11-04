/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import { Check } from '@ndla/icons/editor';
import { colors, spacing, fonts } from '@ndla/core';
import Button from '@ndla/button';

import { StagedTopic } from '../../../TopicArticlePage/components/TopicArticleTaxonomy';
import { LocaleType } from '../../../../../interfaces';

const buttonAdditionStyle = css`
  opacity: 0;
  height: auto;
  padding: 0 ${spacing.small};
  margin: 3px ${spacing.xsmall};
  transition: background 200ms ease;
  ${fonts.sizes(14, 1.1)};
`;

const StyledChecked = styled('div')`
  ${fonts.sizes(16, 1.1)} 
  
  font-weight: ${fonts.weight.semibold};
  display: flex;
  align-items: center;
  
  span {
    margin: 0 ${spacing.xsmall};
  }
  
  svg {
    fill: ${colors.support.green};
  }
`;

const StyledButtonWrapper = styled.div`
  display: flex;

  &:focus-within {
    > button {
      opacity: 1;
    }
  }

  div:hover > & {
    background: #f1f5f8;

    > button,
    > span {
      opacity: 1;
    }
  }

  div:active > & {
    > button,
    > span {
      opacity: 1;
    }
  }
`;

interface Props {
  isSubject?: boolean;
  id?: string;
  closeModal: () => void;
  activeTopics: StagedTopic[];
  addTopic: (id: string | undefined, closeModal: () => void, locale?: LocaleType) => void;
}

const StructureButtons = ({ isSubject, id, closeModal, activeTopics, addTopic }: Props) => {
  const { t, i18n } = useTranslation();
  if (isSubject) {
    return null;
  }

  const currentIndex = activeTopics.findIndex(topic => topic.id === id);

  return (
    <StyledButtonWrapper>
      {currentIndex === -1 ? (
        <Button
          outline
          css={buttonAdditionStyle}
          type="button"
          onClick={() => addTopic(id, closeModal, i18n.language)}>
          {t('taxonomy.topics.filestructureButton')}
        </Button>
      ) : (
        <StyledChecked>
          <Check className="c-icon--22" style={{ fill: colors.support.green }} />{' '}
          <span>{t('taxonomy.topics.addedTopic')}</span>
        </StyledChecked>
      )}
    </StyledButtonWrapper>
  );
};

export default StructureButtons;
