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
  addTopicToTopic,
  addFilterToTopic,
} from '../../../../modules/taxonomy';
import MenuItemButton from './MenuItemButton';
import MenuItemEditField from './MenuItemEditField';

class AddTopic extends React.PureComponent {
  constructor() {
    super();
    this.onAddSubTopic = this.onAddSubTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async onAddSubTopic(name) {
    const { id, numberOfSubtopics, refreshTopics, topicFilters } = this.props;
    const newPath = await addTopic({ name });
    if (!newPath) throw Error('Invalid topic path returned');
    const newId = newPath.replace('/v1/topics/', '');
    await Promise.all([
      addTopicToTopic({
        subtopicid: newId,
        topicid: id,
        primary: true,
        rank: numberOfSubtopics + 1,
      }),
      addFilterToTopic({
        filterId: topicFilters[0].id,
        relevanceId: topicFilters[0].relevanceId,
        topicId: newId,
      }),
    ]);
    refreshTopics();
  }

  toggleEditMode() {
    this.props.toggleEditMode('addTopic');
  }

  render() {
    const { onClose, t, editMode } = this.props;
    return editMode === 'addTopic' ? (
      <MenuItemEditField
        placeholder={t('taxonomy.newTopic')}
        currentVal=""
        messages={{ errorMessage: t('taxonomy.errorMessage') }}
        onClose={onClose}
        onSubmit={this.onAddSubTopic}
        icon={<Plus />}
      />
    ) : (
      <MenuItemButton stripped onClick={this.toggleEditMode}>
        <RoundIcon small icon={<Plus />} />
        {t('taxonomy.addTopic')}
      </MenuItemButton>
    );
  }
}

AddTopic.propTypes = {
  onClose: PropTypes.func,
  editMode: PropTypes.string,
  toggleEditMode: PropTypes.func,
};

export default injectT(AddTopic);
