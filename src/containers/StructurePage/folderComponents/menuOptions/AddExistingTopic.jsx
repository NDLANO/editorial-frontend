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
  fetchTopics,
  addTopicToTopic,
  addFilterToTopic,
  fetchSubjectTopics,
} from '../../../../modules/taxonomy';
import MenuItemButton from './MenuItemButton';
import MenuItemDropdown from './MenuItemDropdown';
import { FilterShape } from '../../../../shapes';

class AddExistingTopic extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      topics: [],
    };
    this.onAddExistingSubTopic = this.onAddExistingSubTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async componentDidMount() {
    const { locale, subjectId } = this.props;
    const topics = await fetchTopics(locale || 'nb');
    const subjectTopics = await fetchSubjectTopics(subjectId);
    this.setState({
      topics: topics.filter(
        topic => !subjectTopics.some(t => t.id === topic.id),
      ),
    });
  }

  async onAddExistingSubTopic(subTopicId) {
    const { id, numberOfSubtopics, refreshTopics, topicFilters } = this.props;
    await Promise.all([
      addTopicToTopic({
        subtopicid: subTopicId,
        topicid: id,
        primary: false,
        rank: numberOfSubtopics + 1,
      }),
      topicFilters[0] &&
        addFilterToTopic({
          filterId: topicFilters[0].id,
          relevanceId: topicFilters[0].relevanceId,
          topicId: subTopicId,
        }),
    ]);
    refreshTopics();
  }

  toggleEditMode() {
    this.props.toggleEditMode('addExistingTopic');
  }

  render() {
    const { t, path, onClose, editMode } = this.props;
    return editMode === 'addExistingTopic' ? (
      <MenuItemDropdown
        placeholder={t('taxonomy.existingTopic')}
        searchResult={this.state.topics}
        filter={path.split('/')[1]}
        onClose={onClose}
        onSubmit={this.onAddExistingSubTopic}
        icon={<Plus />}
      />
    ) : (
      <MenuItemButton stripped onClick={this.toggleEditMode}>
        <RoundIcon small icon={<Plus />} />
        {t('taxonomy.addExistingTopic')}
      </MenuItemButton>
    );
  }
}

AddExistingTopic.propTypes = {
  path: PropTypes.string,
  onClose: PropTypes.func,
  editMode: PropTypes.string,
  toggleEditMode: PropTypes.func,
  locale: PropTypes.string,
  id: PropTypes.string,
  refreshTopics: PropTypes.func.isRequired,
  topicFilters: PropTypes.arrayOf(FilterShape).isRequired,
  numberOfSubtopics: PropTypes.number,
  subjectId: PropTypes.string,
};

export default injectT(AddExistingTopic);
