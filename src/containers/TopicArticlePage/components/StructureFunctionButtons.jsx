/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import { css } from '@emotion/core';
import { Check } from '@ndla/icons/editor';
import { colors, spacing, fonts } from '@ndla/core';
import Button from '@ndla/button';
import FilterView from '../../StructurePage/folderComponents/FilterView';

const buttonAdditionStyle = css`
  opacity: 0;
  height: auto;
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

const StructureFunctionButtons = ({
  isSubject,
  subjectId,
  isOpen,
  id,
  activeTopics,
  availableFilters,
  activeFilters,
  toggleFilter,
  addToTopic,
  addTopic,
  t,
}) => {
  if (isSubject) {
    if (!isOpen) {
      return null;
    }
    return (
      <StyledButtonWrapper>
        <Button
          outline
          css={buttonAdditionStyle}
          type="button"
          onClick={addTopic}>
          {t('taxonomy.topics.addNewTopic')}
        </Button>
        <FilterView
          subjectFilters={availableFilters[subjectId]}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
        />
      </StyledButtonWrapper>
    );
  }

  const currentIndex = activeTopics.findIndex(topic => topic.id === id);

  return (
    <StyledButtonWrapper>
      <Button
        outline
        css={buttonAdditionStyle}
        type="button"
        onClick={addTopic}>
        {t('taxonomy.topics.addNewTopic')}
      </Button>
      {currentIndex === -1 ? (
        <Button
          outline
          css={buttonAdditionStyle}
          type="button"
          onClick={addToTopic}>
          {t('taxonomy.topics.addExistingTopic')}
        </Button>
      ) : (
        <StyledChecked>
          <Check
            className="c-icon--22"
            style={{ fill: colors.support.green }}
          />{' '}
          <span>{t('taxonomy.topics.addedTopic')}</span>
        </StyledChecked>
      )}
    </StyledButtonWrapper>
  );
};

StructureFunctionButtons.propTypes = {
  isSubject: PropTypes.bool,
  subjectId: PropTypes.string,
  isOpen: PropTypes.bool,
  id: PropTypes.string,
  activeTopics: PropTypes.array.isRequired,
  availableFilters: PropTypes.object.isRequired,
  activeFilters: PropTypes.array.isRequired,
  toggleFilter: PropTypes.func.isRequired,
  addToTopic: PropTypes.func.isRequired,
  addTopic: PropTypes.func.isRequired,
};

export default injectT(StructureFunctionButtons);
