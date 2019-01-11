/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Filter } from '@ndla/icons/editor';
import RoundIcon from '../../../../components/RoundIcon';
import EditFilters from '../EditFilters';
import MenuItemButton from './MenuItemButton';

class EditFilterOption extends PureComponent {
  constructor() {
    super();
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  toggleEditMode() {
    this.props.toggleEditMode('editFilters');
  }

  render() {
    const { classes, t, editMode, getFilters, subjectFilters, id } = this.props;
    return (
      <React.Fragment>
        <MenuItemButton
          stripped
          data-testid="editSubjectFiltersButton"
          onClick={this.toggleEditMode}>
          <RoundIcon
            small
            open={editMode === 'editFilters'}
            icon={<Filter />}
          />
          {t('taxonomy.editFilter')}
        </MenuItemButton>
        {editMode === 'editFilters' && (
          <EditFilters
            classes={classes}
            id={id}
            getFilters={getFilters}
            filters={subjectFilters}
          />
        )}
      </React.Fragment>
    );
  }
}

EditFilterOption.propTypes = {
  toggleEditMode: PropTypes.func,
  classes: PropTypes.func,
  refreshTopics: PropTypes.func,
  id: PropTypes.string,
  path: PropTypes.string,
  subjectFilters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }),
  ),
  getFilters: PropTypes.func,
  editMode: PropTypes.string,
};

export default injectT(EditFilterOption);
