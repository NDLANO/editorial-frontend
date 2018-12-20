/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { Plus } from '@ndla/icons/action';
import handleError from '../../../util/handleError';
import MenuItemEditField from './menuOptions/MenuItemEditField';
import {
  createSubjectFilter,
  editSubjectFilter,
  deleteFilter,
} from '../../../modules/taxonomy';
import WarningModal from '../../../components/WarningModal';
import EditFilterList from './EditFilterList';

class EditFilters extends React.Component {
  constructor() {
    super();
    this.state = {
      editMode: '',
    };
    this.addFilter = this.addFilter.bind(this);
    this.showDeleteWarning = this.showDeleteWarning.bind(this);
    this.deleteFilter = this.deleteFilter.bind(this);
    this.editFilter = this.editFilter.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
  }

  setEditMode(name) {
    this.setState({ editMode: name });
  }

  async editFilter(id, name) {
    try {
      await editSubjectFilter(id, this.props.id, name);
      this.props.getFilters();
    } catch (e) {
      handleError(e);
      this.setState({ error: e.message });
    }
  }

  showDeleteWarning(filterId) {
    this.setState({ showDelete: filterId });
  }

  async deleteFilter() {
    try {
      await deleteFilter(this.state.showDelete);
      this.props.getFilters();
    } catch (e) {
      handleError(e);
      this.setState({ error: e.message });
    }
    this.setState({ showDelete: false });
  }

  async addFilter(name) {
    try {
      await createSubjectFilter(this.props.id, name);
      this.props.getFilters();
    } catch (e) {
      handleError(e);
      this.setState({ error: e.message });
    }
  }

  render() {
    const { classes, t, filters } = this.props;
    const { editMode, showDelete, error } = this.state;

    return (
      <div {...classes('editFilters')} data-testid="editFilterBox">
        <EditFilterList
          filters={filters}
          editMode={editMode}
          classes={classes}
          setEditState={this.setEditMode}
          showDeleteWarning={this.showDeleteWarning}
          editFilter={this.editFilter}
        />
        {editMode === 'addFilter' ? (
          <MenuItemEditField
            classes={classes}
            currentVal=""
            messages={{ errorMessage: t('taxonomy.errorMessage') }}
            dataTestid="addFilterInput"
            onClose={this.setEditMode}
            onSubmit={this.addFilter}
          />
        ) : (
          <Button
            stripped
            {...classes('addFilter')}
            data-testid="addFilterButton"
            onClick={() => this.setState({ editMode: 'addFilter' })}>
            <Plus />
            {t('taxonomy.addFilter')}
          </Button>
        )}
        <div {...classes('errorMessage')}>{error}</div>

        <WarningModal
          show={showDelete}
          actions={[
            {
              text: t('form.abort'),
              onClick: () => this.showDeleteWarning(),
            },
            {
              text: t('warningModal.delete'),
              'data-testid': 'warningModalConfirm',
              action: this.deleteFilter,
            },
          ]}
          text={t('taxonomy.confirmDelete')}
          onCancel={this.showDeleteWarning}
        />
      </div>
    );
  }
}

EditFilters.propTypes = {
  id: PropTypes.string,
  t: PropTypes.func,
  classes: PropTypes.func,
  filters: PropTypes.arrayOf(PropTypes.object),
  getFilters: PropTypes.func,
};

export default injectT(EditFilters);
