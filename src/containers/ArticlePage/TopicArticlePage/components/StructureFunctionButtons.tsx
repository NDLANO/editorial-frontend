/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Check } from '@ndla/icons/editor';
import { colors, spacing, fonts } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';

interface Props {
  isSubject?: boolean;
  isOpen?: boolean;
  id?: string;
  activeTopics: { id: string }[];
  addTopic: () => Promise<void>;
}

const StyledButton = styled(ButtonV2)`
  opacity: 0;
  height: auto;
  min-height: 30px;
  padding: 0 ${spacing.small};
  margin: 3px ${spacing.xsmall};
  transition: background 200ms ease;
  ${fonts.sizes(14, 1.1)};
`;

const StyledChecked = styled('div')`
  ${fonts.sizes(16, 1.1)} font-weight: ${fonts.weight.semibold};
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

const StructureFunctionButtons = ({ isSubject, isOpen, id, activeTopics, addTopic }: Props) => {
  const { t } = useTranslation();
  if (isSubject) {
    if (!isOpen) {
      return null;
    }
    return (
      <StyledButtonWrapper>
        <StyledButton variant="outline" onClick={addTopic}>
          {t('taxonomy.topics.addNewTopic')}
        </StyledButton>
      </StyledButtonWrapper>
    );
  }

  const currentIndex = activeTopics.findIndex((topic) => topic.id === id);

  return (
    <StyledButtonWrapper>
      <StyledButton variant="outline" onClick={addTopic}>
        {t('taxonomy.topics.addNewSubTopic')}
      </StyledButton>
      {currentIndex !== -1 && (
        <StyledChecked>
          <Check className="c-icon--22" style={{ fill: colors.support.green }} />{' '}
          <span>{t('taxonomy.topics.addedTopic')}</span>
        </StyledChecked>
      )}
    </StyledButtonWrapper>
  );
};

export default StructureFunctionButtons;
