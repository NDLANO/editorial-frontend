/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { string, bool, arrayOf, shape, func } from 'prop-types';
import { spacing, fonts, colors } from '@ndla/core';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { withRouter } from 'react-router-dom';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import BEMHelper from 'react-bem-helper';
import SettingsMenu from './SettingsMenu';
import FilterView from './FilterView';

import { TAXONOMY_ADMIN_SCOPE } from '../../../constants';
import AlertModal from '../../../components/AlertModal';

export const classes = new BEMHelper({
  name: 'folder',
  prefix: 'c-',
});

const resourceButtonStyle = css`
  margin: 3px ${spacing.xsmall} 3px auto;
  ${fonts.sizes(14, 1.1)};
`;

const FilterLabel = styled.div`
  padding: 12px 6px;
  color: ${colors.brand.grey};
  ${fonts.sizes(14, 1.1)};
`;

const FilterSpan = styled.span`
  padding: 0px 6px;
  color: ${colors.brand.grey};
  ${fonts.sizes(14, 1.1)};
`;

const FolderItem = ({
  name,
  pathToString,
  match,
  id,
  isOpen,
  refFunc,
  showLink,
  linkViewOpen,
  activeFilters,
  toggleFilter,
  setPrimary,
  deleteTopicLink,
  jumpToResources,
  isMainActive,
  filters,
  t,
  userAccess,
  metadata,
  ...rest
}) => {
  const type = id.includes('subject') ? 'subject' : 'topic';

  const showSubjectFilters = isOpen && type === 'subject';
  const showTopicFilters = type !== 'subject';
  const showJumpToResources = isMainActive && type === 'topic';

  const [showAlertModal, setShowAlertModal] = useState(false);

  return (
    <div data-cy="folderWrapper" {...classes('wrapper')}>
      {isMainActive && (
        <SettingsMenu
          id={id}
          name={name}
          type={type}
          path={pathToString}
          topicFilters={filters}
          showAllOptions={
            userAccess && userAccess.includes(TAXONOMY_ADMIN_SCOPE)
          }
          metadata={metadata}
          setShowAlertModal={setShowAlertModal}
          {...rest}
        />
      )}
      {showSubjectFilters && (
        <FilterView
          subjectFilters={rest.subjectFilters}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
        />
      )}
      {showTopicFilters && (
        <FilterLabel>
          {t('form.filter.label')}:
          {filters.map(filter => (
            <FilterSpan>{filter.name}</FilterSpan>
          ))}
        </FilterLabel>
      )}
      {showJumpToResources && (
        <Button
          outline
          css={resourceButtonStyle}
          type="button"
          onClick={jumpToResources}>
          {t('taxonomy.jumpToResources')}
        </Button>
      )}
      {
        <AlertModal
          show={showAlertModal}
          text={t('taxonomy.resource.copyError')}
          actions={[
            {
              text: t('alertModal.continue'),
              onClick: () => {
                setShowAlertModal(false);
              },
            },
          ]}
          onCancel={() => {
            setShowAlertModal(false);
          }}
        />
      }
    </div>
  );
};

FolderItem.propTypes = {
  name: string.isRequired,
  pathToString: string,
  isOpen: bool,
  match: shape({
    params: shape({
      topic1: string,
      topic2: string,
      subject: string,
    }),
  }),
  isMainActive: bool,
  id: string.isRequired,
  refFunc: func,
  jumpToResources: func,
  showLink: func,
  linkViewOpen: bool,
  activeFilters: arrayOf(string),
  toggleFilter: func,
  setPrimary: func,
  deleteTopicLink: func,
  refreshTopics: func,
  filters: arrayOf(
    shape({
      id: string,
    }),
  ),
  userAccess: string,
  metadata: shape({
    grepCodes: arrayOf(string),
    visible: bool,
  }),
};

export default withRouter(injectT(FolderItem));
