/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectT } from 'ndla-i18n';
import { OneColumn, ContentTypeBadge } from 'ndla-ui';
import { Taxonomy } from 'ndla-icons/editor';
import { getLocale } from '../../modules/locale/locale';
import FolderItem from './components/FolderItem';
import ResourceGroup from './components/ResourceGroup';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../constants';
import { groupSortResourceTypesFromTopicResources } from '../../util/taxonomyHelpers';
import InlineAddButton from './components/InlineAddButton';
import Accordion from '../../components/Accordion';
import {
  fetchSubjects,
  fetchSubjectTopics,
  fetchAllResourceTypes,
  fetchTopicResources,
  addSubject,
  addTopic,
  updateSubjectName,
  addSubjectTopic,
} from '../../modules/taxonomy';

export class StructurePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editStructureHidden: false,
      resourceTypes: [],
      topicResources: [],
      subjects: [],
      topics: {},
    };
    this.getAllSubjects = this.getAllSubjects.bind(this);
    this.getAllResourceTypes = this.getAllResourceTypes.bind(this);
    this.getSubjectTopics = this.getSubjectTopics.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.onChangeSubjectName = this.onChangeSubjectName.bind(this);
    this.onAddSubjectTopic = this.onAddSubjectTopic.bind(this);
    this.getTopicResources = this.getTopicResources.bind(this);
  }

  async componentDidMount() {
    this.getAllSubjects();
    await this.getAllResourceTypes();
    const id = this.props.match.params.subject;
    const topicId =
      this.props.match.params.topic2 || this.props.match.params.topic1;
    if (id) {
      this.getSubjectTopics(`urn:${id}`);
    }
    if (topicId) {
      this.getTopicResources(`urn:${topicId}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    const id = `urn:${nextProps.match.params.subject}`;
    const topicId =
      nextProps.match.params.topic2 || nextProps.match.params.topic1;
    const currentSub = this.state.subjects.find(it => it.id === id);
    if (id && currentSub && !this.state.topics[id]) {
      this.getSubjectTopics(id);
    }
    if (topicId) {
      this.getTopicResources(`urn:${topicId}`);
    } else {
      this.setState({ topicResources: [] });
    }
  }

  async onChangeSubjectName(subjectId, name) {
    try {
      const ok = await updateSubjectName(subjectId, name);
      this.getAllSubjects();
      return ok;
    } catch (e) {
      return e;
    }
  }

  async onAddSubjectTopic(subjectid, name) {
    const newPath = await addTopic({ name });
    const newId = newPath.replace('/v1/topics/', '');
    const ok = await addSubjectTopic({
      subjectid,
      topicid: newId,
      primary: true,
    });
    if (ok) {
      this.getSubjectTopics(subjectid);
    }
  }

  async getAllSubjects() {
    const subjects = await fetchSubjects();
    this.setState({ subjects });
  }
  async getAllResourceTypes() {
    const resourceTypes = await fetchAllResourceTypes(this.props.locale);
    this.setState({ resourceTypes });
  }

  async getSubjectTopics(subjectid) {
    const allTopics = await fetchSubjectTopics(subjectid);
    const mainTopics = allTopics.filter(it => it.parent === subjectid);
    const groupedTopics = mainTopics.map(topic => ({
      ...topic,
      topics: allTopics.filter(it => it.parent === topic.id),
    }));

    this.setState(prevState => ({
      topics: {
        ...prevState.topics,
        [subjectid]: groupedTopics,
      },
    }));
  }

  async getTopicResources(topicId) {
    const { locale } = this.props;
    const { resourceTypes } = this.state;

    const [
      coreTopicResources = [],
      supplementaryTopicResources = [],
    ] = await Promise.all([
      fetchTopicResources(topicId, locale, RESOURCE_FILTER_CORE),
      fetchTopicResources(topicId, locale, RESOURCE_FILTER_SUPPLEMENTARY),
    ]);

    const topicResources = groupSortResourceTypesFromTopicResources(
      resourceTypes,
      coreTopicResources,
      supplementaryTopicResources,
    );
    this.setState({ topicResources });
  }

  async addSubject(name) {
    try {
      const newPath = await addSubject({ name });
      if (newPath) this.getAllSubjects();
      return newPath;
    } catch (e) {
      return e;
    }
  }

  render() {
    const { match: { params }, t } = this.props;

    return (
      <OneColumn>
        <Accordion
          handleToggle={() =>
            this.setState(prevState => ({
              editStructureHidden: !prevState.editStructureHidden,
            }))
          }
          header={
            <React.Fragment>
              <Taxonomy className="c-icon--medium" />
              {t('taxonomy.editStructure')}
            </React.Fragment>
          }
          taxonomy
          addButton={
            <InlineAddButton
              title={t('taxonomy.addSubject')}
              action={this.addSubject}
            />
          }
          hidden={this.state.editStructureHidden}>
          {this.state.subjects.map(it => (
            <FolderItem
              {...it}
              key={it.id}
              topics={this.state.topics[it.id]}
              active={it.id.replace('urn:', '') === params.subject}
              params={params}
              t={t}
              onChangeSubjectName={this.onChangeSubjectName}
              onAddSubjectTopic={this.onAddSubjectTopic}
            />
          ))}
        </Accordion>
        {this.state.topicResources.map(topicResource => (
          <ResourceGroup
            key={topicResource.id}
            icon={
              <ContentTypeBadge background type={topicResource.contentType} />
            }
            {...{ topicResource }}
          />
        ))}
      </OneColumn>
    );
  }
}

StructurePage.propTypes = {
  locale: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subject: PropTypes.string,
      topic1: PropTypes.string,
      topic2: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default compose(injectT, connect(mapStateToProps, null))(StructurePage);
