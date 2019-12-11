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
  addSubjectTopic,
  fetchTopics,
  fetchTopicConnections,
  deleteTopicConnection,
  deleteSubTopicConnection,
} from '../../../../modules/taxonomy';
import MenuItemDropdown from './MenuItemDropdown';
import MenuItemButton from './MenuItemButton';
import { FilterShape } from '../../../../shapes';
import retriveBreadCrumbs from '../../../../util/retriveBreadCrumbs';

class AddExistingToSubjectTopic extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      topics: [],
    };
    this.onAddExistingTopic = this.onAddExistingTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async componentDidMount() {
    const { locale } = this.props;
    const topics = await fetchTopics(locale || 'nb');

    this.setState({
      topics: topics.map(topic => ({
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

  async onAddExistingTopic(topic) {
    const { id, refreshTopics } = this.props;
    const connections = await fetchTopicConnections(topic.id);

    if(connections && connections.length > 0){
      const connectionId = connections[0].connectionId
      if (connectionId.includes('topic-subtopic')) {
        await deleteSubTopicConnection(connectionId);
      } else {
        await deleteTopicConnection(connectionId);
      }
    }

    await Promise.all([
      addSubjectTopic({
        subjectid: id,
        topicid: topic.id,
      }),
    ]);
    refreshTopics();
  }

  toggleEditMode() {
    this.props.toggleEditMode('addExistingSubjectTopic');
  }

  render() {
    const { onClose, t, editMode } = this.props;
    if (editMode === 'addExistingSubjectTopic') {
      return (
        <MenuItemDropdown
          searchResult={this.state.topics}
          placeholder={t('taxonomy.existingTopic')}
          onClose={onClose}
          onSubmit={this.onAddExistingTopic}
          icon={<Plus />}
        />
      );
    }
    return (
      <MenuItemButton
        stripped
        data-testid="addExistingSubjectTopicButton"
        onClick={this.toggleEditMode}>
        <RoundIcon small icon={<Plus />} />
        {t('taxonomy.addExistingTopic')}
      </MenuItemButton>
    );
  }
}

AddExistingToSubjectTopic.propTypes = {
  classes: PropTypes.func,
  path: PropTypes.string,
  onClose: PropTypes.func,
  editMode: PropTypes.string,
  toggleEditMode: PropTypes.func,
  locale: PropTypes.string,
  subjectFilters: PropTypes.arrayOf(FilterShape),
  id: PropTypes.string.isRequired,
  refreshTopics: PropTypes.func.isRequired,
  subjectId: PropTypes.string,
  structure: PropTypes.arrayOf(PropTypes.object),
};

export default injectT(AddExistingToSubjectTopic);
