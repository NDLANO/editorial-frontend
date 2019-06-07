/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Plus } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import RoundIcon from '../../../../components/RoundIcon';
import {
  addTopic,
  addSubjectTopic,
  addFilterToTopic,
} from '../../../../modules/taxonomy';
import MenuItemButton from './MenuItemButton';
import MenuItemEditField from './MenuItemEditField';
import { FilterShape } from '../../../../shapes';

class AddSubjectTopic extends React.PureComponent {
  constructor() {
    super();
    this.onAddSubjectTopic = this.onAddSubjectTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async onAddSubjectTopic(name) {
    const { id, refreshTopics, subjectFilters } = this.props;
    const newPath = await addTopic({ name });
    if (!newPath) throw Error('Invalid topic path returned');
    const newId = newPath.replace('/v1/topics/', '');
    await Promise.all([
      addSubjectTopic({
        subjectid: id,
        topicid: newId,
        primary: true,
        // rank: this.state.topics[subjectid].length + 1,
      }),
      addFilterToTopic({
        filterId: subjectFilters[0].id,
        topicId: newId,
      }),
    ]);
    refreshTopics();
  }

  toggleEditMode() {
    this.props.toggleEditMode('addSubjectTopic');
  }

  render() {
    const { onClose, t, editMode } = this.props;
    return editMode === 'addSubjectTopic' ? (
      <MenuItemEditField
        placeholder={t('taxonomy.newSubject')}
        currentVal=""
        messages={{ errorMessage: t('taxonomy.errorMessage') }}
        onClose={onClose}
        onSubmit={this.onAddSubjectTopic}
        icon={<Plus />}
      />
    ) : (
      <MenuItemButton
        stripped
        data-testid="addSubjectTopicButon"
        onClick={this.toggleEditMode}>
        <RoundIcon small icon={<Plus />} />
        {t('taxonomy.addTopic')}
      </MenuItemButton>
    );
  }
}

AddSubjectTopic.propTypes = {
  onClose: PropTypes.func,
  editMode: PropTypes.string,
  toggleEditMode: PropTypes.func,
  id: PropTypes.string,
  refreshTopics: PropTypes.func.isRequired,
  subjectFilters: PropTypes.arrayOf(FilterShape).isRequired,
};

export default injectT(AddSubjectTopic);
