/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import PropTypes from 'prop-types';
import React from 'react';
import { Concept } from '@ndla/icons/editor';
import { spacing, colors } from '@ndla/core';
import Button from '@ndla/button';
import css from '@emotion/css';
import { Check } from '@ndla/icons/lib/editor';
import Tooltip from '@ndla/tooltip';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import Spinner from '../../../../components/Spinner';
import { SearchResultShape } from '../../../../shapes';

const StyledConceptResult = styled.div`
  display: grid;
  grid-template-columns: 10% 70% 20%;
  grid-template-rows: auto auto;
  padding: ${spacing.normal} 0;
  border-bottom: 1px solid ${colors.brand.greyLight};
  &:last-child {
    border: none;
  }
`;

const StyledConceptResultHeader = styled.h1`
  display: flex;
  grid-column: 2 / 2;
  grid-row: 1 / 1;
  margin: 0;
`;

const StyledConceptContent = styled.p`
  grid-row: 2 / 2;
  grid-column: 2 / 2;
  margin: 0;
`;

const StyledButton = styled(Button)`
  grid-row-start: 1 / 3;
  grid-column: 3 / 3;
  align-self: center;
`;

const StyledCheckIcon = styled(Check)`
  margin-left: 10px;
  margin-top: 2px;
  height: 25px;
  width: 25px;
  fill: ${colors.support.green};
`;

const SearchConceptResults = ({
  results,
  searchObject,
  addConcept,
  t,
  searching,
}) => {
  return (
    <div>
      {searching && <Spinner appearance="absolute" />}
      {results.length === 0 ? (
        <p>{t(`searchPage.conceptNoHits`, { query: searchObject.query })}</p>
      ) : null}
      {results.map(result => (
        <StyledConceptResult key={result.id}>
          <Concept
            className="c-icon--large"
            css={css`
                    grid-column: 1 / 2;
                    grid-row: 1 / 2;
                }
            `}
          />
          <StyledConceptResultHeader>
            {convertFieldWithFallback(
              result,
              'title',
              t('conceptSearch.noTitle'),
            )}
            {(result.status.current === 'PUBLISHED' ||
              result.status.other.includes('PUBLISHED')) && (
              <Tooltip tooltip={t('form.workflow.published')}>
                <StyledCheckIcon title={t('form.status.published')} />
              </Tooltip>
            )}
          </StyledConceptResultHeader>
          <StyledConceptContent>
            {convertFieldWithFallback(
              result,
              'content',
              t('conceptSearch.noContent'),
            )}
          </StyledConceptContent>
          <StyledButton
            onClick={evt => {
              evt.stopPropagation();
              addConcept(result);
            }}>
            {t('form.content.concept.choose')}
          </StyledButton>
        </StyledConceptResult>
      ))}
    </div>
  );
};

SearchConceptResults.propTypes = {
  results: PropTypes.arrayOf(SearchResultShape).isRequired,
  searchObject: PropTypes.shape({
    query: PropTypes.string,
    language: PropTypes.string,
  }),
  searching: PropTypes.bool,
  addConcept: PropTypes.func.isRequired,
};

SearchConceptResults.defaultProps = {
  searching: true,
};

export default injectT(SearchConceptResults);
