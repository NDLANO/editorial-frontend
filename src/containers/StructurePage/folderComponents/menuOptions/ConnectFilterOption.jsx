/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Filter } from '@ndla/icons/editor';
import RoundIcon from '../../../../components/RoundIcon';
import ConnectFilters from '../ConnectFilters';
import MenuItemButton from './MenuItemButton';

class ConnectFilterOption extends PureComponent {
  constructor() {
    super();
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  toggleEditMode() {
    this.props.toggleEditMode('connectFilters');
  }

  render() {
    const {
      id,
      path,
      topicFilters,
      refreshTopics,
      subjectFilters,
      editMode,
      t,
    } = this.props;
    return (
      <Fragment>
        <MenuItemButton stripped onClick={this.toggleEditMode}>
          <RoundIcon
            small
            open={editMode === 'connectFilters'}
            icon={<Filter />}
          />
          {t('taxonomy.connectFilters')}
        </MenuItemButton>
        {editMode === 'connectFilters' && (
          <ConnectFilters
            path={path}
            id={id}
            subjectFilters={subjectFilters}
            refreshTopics={refreshTopics}
            topicFilters={topicFilters}
          />
        )}
      </Fragment>
    );
  }
}

ConnectFilterOption.propTypes = {
  toggleEditMode: PropTypes.func,
  refreshTopics: PropTypes.func,
  id: PropTypes.string,
  path: PropTypes.string,
  topicFilters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  subjectFilters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  editMode: PropTypes.string,
};

export default injectT(ConnectFilterOption);
