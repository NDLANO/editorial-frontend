/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Pencil, Plus } from 'ndla-icons/action';
import { DeleteForever } from 'ndla-icons/editor';
import InlineEditField from './InlineEditField';
import {
  fetchSubjectFilters,
  createSubjectFilter,
  editSubjectFilter,
  deleteFilter,
} from '../../../modules/taxonomy';
import WarningModal from '../../../components/WarningModal';

class EditFilters extends React.Component {
  constructor() {
    super();
    this.state = {
      editMode: '',
      filters: [],
    };
    this.addFilter = this.addFilter.bind(this);
    this.getFilters = this.getFilters.bind(this);
    this.showDeleteWarning = this.showDeleteWarning.bind(this);
    this.deleteFilter = this.deleteFilter.bind(this);
  }

  componentDidMount() {
    this.getFilters();
  }

  async getFilters() {
    const filters = await fetchSubjectFilters(this.props.id);
    this.setState({ filters, error: '' });
  }

  async addFilter(name) {
    try {
      await createSubjectFilter(this.props.id, name);
      this.getFilters();
      return true;
    } catch (e) {
      this.setState({ error: e.message });
      return false;
    }
  }

  async editFilter(id, name) {
    try {
      await editSubjectFilter(id, this.props.id, name);
      this.getFilters();
      return true;
    } catch (e) {
      this.setState({ error: e.message });
      return false;
    }
  }

  showDeleteWarning(filterId) {
    this.setState({ showDelete: filterId });
  }

  async deleteFilter() {
    try {
      await deleteFilter(this.state.showDelete);
      this.getFilters();
    } catch (e) {
      this.setState({ error: e });
    }
    this.setState({ showDelete: false });
  }

  render() {
    const { classes, t } = this.props;
    const { editMode, filters, showDelete } = this.state;

    return (
      <div {...classes('editFilters')}>
        {filters.map(
          filter =>
            editMode === filter.name ? (
              <InlineEditField
                key={filter.id}
                classes={classes}
                messages={{ errorMessage: t('taxonomy.errorMessage') }}
                currentVal={filter.name}
                onClose={() => this.setState({ editMode: '' })}
                onSubmit={e => this.editFilter(filter.id, e)}
              />
            ) : (
              <div key={filter.id} {...classes('filterItem')}>
                {filter.name}
                <div style={{ display: 'flex' }}>
                  <Button
                    stripped
                    data-testid={`editFilter${filter.id}`}
                    onClick={() => this.setState({ editMode: filter.name })}
                    {...classes('iconButton', 'item')}>
                    {<Pencil />}
                  </Button>
                  <Button
                    stripped
                    data-testid={`deleteFilter${filter.id}`}
                    onClick={() => this.showDeleteWarning(filter.id)}
                    {...classes('iconButton', 'item')}>
                    {<DeleteForever />}
                  </Button>
                </div>
              </div>
            ),
        )}
        {editMode === 'addFilter' ? (
          <InlineEditField
            classes={classes}
            currentVal=""
            messages={{ errorMessage: t('taxonomy.errorMessage') }}
            dataTestid="addFilterInput"
            onClose={() => this.setState({ editMode: '' })}
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
        <div {...classes('errorMessage')}>{this.state.error}</div>
        {showDelete && (
          <WarningModal
            confirmDelete
            text={t('taxonomy.confirmDelete')}
            onContinue={this.deleteFilter}
            onCancel={() => this.setState({ showDelete: '' })}
          />
        )}
      </div>
    );
  }
}

EditFilters.propTypes = {
  id: PropTypes.string,
  t: PropTypes.func,
  classes: PropTypes.func,
};

export default EditFilters;
