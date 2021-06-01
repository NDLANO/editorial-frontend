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
  fetchTopicConnections,
  deleteSubTopicConnection,
  deleteTopicConnection,
  fetchTopicFilters,
} from '../../../../modules/taxonomy';
import MenuItemButton from './MenuItemButton';
import MenuItemDropdown from './MenuItemDropdown';
import { FilterShape } from '../../../../shapes';
import retriveBreadCrumbs from '../../../../util/retriveBreadCrumbs';

class AddExistingToTopic extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      topics: [],
    };
    this.onAddExistingSubTopic = this.onAddExistingSubTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async componentDidMount() {
    const { locale, path } = this.props;
    const topics = await fetchTopics(locale || 'nb');
    this.setState({
      topics: topics
        .filter(topic => topic.path)
        .filter(topic => !topic.paths?.find(p => path.includes(p)))
        .map(topic => ({
          ...topic,
          description: this.getTopicBreadcrumb(topic, topics),
        })),
    });
  }

  getTopicBreadcrumb = (topic, topics) => {
    if (!topic.path) return undefined;
    const bc = retriveBreadCrumbs({
      topicPath: topic.path,
      structure: this.props.structure,
      allTopics: topics,
      title: topic.name,
    });
    return bc.map(crumb => crumb.name).join(' > ');
  };

  async onAddExistingSubTopic(topic) {
    const { id, numberOfSubtopics = 0, refreshTopics, topicFilters } = this.props;
    const connections = await fetchTopicConnections(topic.id);

    if (connections && connections.length > 0) {
      const connectionId = connections[0].connectionId;
      if (connectionId.includes('topic-subtopic')) {
        await deleteSubTopicConnection(connectionId);
      } else {
        await deleteTopicConnection(connectionId);
      }
    }

    const filters = await fetchTopicFilters(topic.id);

    await Promise.all([
      addTopicToTopic({
        subtopicid: topic.id,
        topicid: id,
        primary: false,
        rank: numberOfSubtopics + 1,
      }),
      topicFilters.map(filter => {
        if (!filters.map(f => f.id).includes(filter.id)) {
          addFilterToTopic({
            filterId: filter.id,
            relevanceId: filter.relevanceId,
            topicId: topic.id,
          });
        }
        return filter;
      }),
    ]);
    refreshTopics();
  }

  toggleEditMode() {
    this.props.toggleEditMode('addExistingTopic');
  }

  render() {
    const { t, onClose, editMode } = this.props;
    return editMode === 'addExistingTopic' ? (
      <MenuItemDropdown
        placeholder={t('taxonomy.existingTopic')}
        searchResult={this.state.topics}
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

AddExistingToTopic.propTypes = {
  path: PropTypes.string,
  onClose: PropTypes.func,
  editMode: PropTypes.string,
  toggleEditMode: PropTypes.func,
  locale: PropTypes.string,
  id: PropTypes.string,
  refreshTopics: PropTypes.func.isRequired,
  topicFilters: PropTypes.arrayOf(FilterShape).isRequired,
  numberOfSubtopics: PropTypes.number,
  structure: PropTypes.arrayOf(PropTypes.object),
};

export default injectT(AddExistingToTopic);
