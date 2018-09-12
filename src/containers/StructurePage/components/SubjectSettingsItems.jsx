/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pencil, Plus } from 'ndla-icons/action';
import { injectT } from 'ndla-i18n';
import { Filter } from 'ndla-icons/editor';
import { Button } from 'ndla-ui';
import { fetchTopics } from '../../../modules/taxonomy';
import InlineEditField from './InlineEditField';
import InlineDropdown from './InlineDropdown';
import EditFilters from './EditFilters';
import RoundIcon from '../../../components/RoundIcon';

class SubjectSettingsItems extends Component {
  constructor() {
    super();
    this.state = {
      editMode: '',
    };
  }

  render() {
    const {
      classes,
      onChangeSubjectName,
      onAddSubjectTopic,
      onAddExistingTopic,
      id,
      name,
      onClose,
      t,
      getFilters,
      subjectFilters,
    } = this.props;
    const { editMode } = this.state;

    return (
      <React.Fragment>
        {editMode === 'changeName' ? (
          <InlineEditField
            classes={classes}
            currentVal={name}
            messages={{ errorMessage: t('taxonomy.errorMessage') }}
            onSubmit={e => onChangeSubjectName(id, e)}
            onClose={onClose}
            icon={<Pencil />}
          />
        ) : (
          <Button
            {...classes('menuItem')}
            stripped
            data-testid="changeSubjectNameButton"
            onClick={() => this.setState({ editMode: 'changeName' })}>
            <RoundIcon small icon={<Pencil />} />
            {t('taxonomy.changeName')}
          </Button>
        )}
        {editMode === 'addTopic' ? (
          <InlineEditField
            classes={classes}
            currentVal=""
            messages={{ errorMessage: t('taxonomy.errorMessage') }}
            onClose={onClose}
            onSubmit={e => onAddSubjectTopic(id, e)}
            icon={<Plus />}
          />
        ) : (
          <Button
            {...classes('menuItem')}
            stripped
            data-testid="addSubjectTopicButon"
            onClick={() => this.setState({ editMode: 'addTopic' })}>
            <RoundIcon small icon={<Plus />} />
            {t('taxonomy.addTopic')}
          </Button>
        )}
        {editMode === 'addExistingTopic' ? (
          <InlineDropdown
            fetchItems={() => fetchTopics('nb')}
            classes={classes}
            onClose={onClose}
            onSubmit={e => onAddExistingTopic(id, e)}
            icon={<Plus />}
          />
        ) : (
          <Button
            {...classes('menuItem')}
            stripped
            data-testid="addExistingSubjectTopicButton"
            onClick={() => this.setState({ editMode: 'addExistingTopic' })}>
            <RoundIcon small icon={<Plus />} />
            {t('taxonomy.addExistingTopic')}
          </Button>
        )}
        <Button
          {...classes('menuItem')}
          stripped
          data-testid="editSubjectFiltersButton"
          onClick={() =>
            this.setState(prevState => ({
              editMode: prevState.editMode === 'editFilter' ? '' : 'editFilter',
            }))
          }>
          <RoundIcon small open={editMode === 'editFilter'} icon={<Filter />} />
          {t('taxonomy.editFilter')}
        </Button>
        {editMode === 'editFilter' && (
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

SubjectSettingsItems.propTypes = {
  classes: PropTypes.func,
  onChangeSubjectName: PropTypes.func,
  onAddSubjectTopic: PropTypes.func,
  onAddExistingTopic: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  onClose: PropTypes.func,
  t: PropTypes.func,
  getFilters: PropTypes.func,
  subjectFilters: PropTypes.arrayOf(PropTypes.object),
};

export default injectT(SubjectSettingsItems);
