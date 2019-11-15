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
  addFilterToTopic,
  fetchSubjectTopics,
} from '../../../../modules/taxonomy';
import MenuItemDropdown from './MenuItemDropdown';
import MenuItemButton from './MenuItemButton';
import { FilterShape } from '../../../../shapes';
import retriveBreadCrumbs from '../../../../util/retriveBreadCrumbs';

class AddExistingSubjectTopic extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      topics: [],
    };
    this.onAddExistingTopic = this.onAddExistingTopic.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async componentDidMount() {
    const { locale, subjectId } = this.props;
    const topics = await fetchTopics(locale || 'nb');
    const subjectTopics = await fetchSubjectTopics(subjectId);

    this.setState({
      topics: topics
        .filter(topic => !subjectTopics.some(t => t.id === topic.id))
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

  async onAddExistingTopic(topicid) {
    const { id, refreshTopics, subjectFilters } = this.props;
    await Promise.all([
      addSubjectTopic({
        subjectid: id,
        topicid,
      }),
      subjectFilters[0] &&
        addFilterToTopic({
          filterId: subjectFilters[0].id,
          topicId: topicid,
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

AddExistingSubjectTopic.propTypes = {
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

export default injectT(AddExistingSubjectTopic);
