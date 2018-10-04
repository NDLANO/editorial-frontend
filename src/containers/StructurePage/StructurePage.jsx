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
import queryString from 'query-string';
import { injectT } from 'ndla-i18n';
import { OneColumn } from 'ndla-ui';
import { Taxonomy, Star } from 'ndla-icons/editor';
import { connectLinkItems } from '../../util/jsPlumbHelpers';
import handleError from '../../util/handleError';
import { getLocale } from '../../modules/locale/locale';
import StructureResources from './StructureResources';
import FolderItem from './folderComponents/FolderItem';
import InlineAddButton from '../../components/InlineAddButton';
import Accordion from '../../components/Accordion';
import ErrorBoundary from '../../components/ErrorBoundary';
import {
  fetchSubjects,
  fetchSubjectTopics,
  addSubject,
  addTopic,
  updateSubjectName,
  fetchSubjectFilters,
  addSubjectTopic,
  fetchTopicConnections,
  updateTopicSubtopic,
  updateSubjectTopic,
  deleteTopicConnection,
  deleteSubTopicConnection,
} from '../../modules/taxonomy';
import { groupTopics } from '../../util/taxonomyHelpers';
import RoundIcon from '../../components/RoundIcon';

export class StructurePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editStructureHidden: false,
      subjects: [],
      topics: {},
      filters: [],
      jsPlumbConnections: [],
      activeConnections: [],
    };
    this.starButton = React.createRef();
    this.getAllSubjects = this.getAllSubjects.bind(this);
    this.getSubjectTopics = this.getSubjectTopics.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.onChangeSubjectName = this.onChangeSubjectName.bind(this);
    this.onAddSubjectTopic = this.onAddSubjectTopic.bind(this);
    this.showLink = this.showLink.bind(this);
    this.refFunc = this.refFunc.bind(this);
    this.deleteConnections = this.deleteConnections.bind(this);
    this.onAddExistingTopic = this.onAddExistingTopic.bind(this);
    this.getCurrentTopic = this.getCurrentTopic.bind(this);
    this.getFilters = this.getFilters.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.setPrimary = this.setPrimary.bind(this);
    this.getActiveFiltersFromUrl = this.getActiveFiltersFromUrl.bind(this);
    this.deleteTopicLink = this.deleteTopicLink.bind(this);
  }

  componentDidMount() {
    this.getAllSubjects();
    const { subject } = this.props.match.params;
    if (subject) {
      this.getSubjectTopics(`urn:${subject}`);
      this.getFilters(`urn:${subject}`);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location: { pathname },
      match: { params },
      history,
    } = this.props;
    if (pathname !== prevProps.location.pathname) {
      this.deleteConnections();
      const { subject } = params;
      if (subject) {
        this.getFilters(`urn:${subject}`);
      }
      if (!subject || subject !== prevProps.match.params.subject) {
        history.push({
          search: '',
        });
      }
      const currentSub = this.state.subjects.find(
        sub => sub.id === `urn:${subject}`,
      );
      if (currentSub && !this.state.topics[`urn:${subject}`]) {
        this.getSubjectTopics(`urn:${subject}`);
      }
    }
  }

  async onChangeSubjectName(subjectId, name) {
    const ok = await updateSubjectName(subjectId, name);
    this.getAllSubjects();
    return ok;
  }

  async onAddExistingTopic(subjectid, topicid) {
    const ok = await addSubjectTopic({
      subjectid,
      topicid,
    });
    if (ok) {
      this.getSubjectTopics(subjectid);
    }
  }

  async onAddSubjectTopic(subjectid, name) {
    const newPath = await addTopic({ name });
    const newId = newPath.replace('/v1/topics/', '');
    const ok = await addSubjectTopic({
      subjectid,
      topicid: newId,
      primary: true,
      rank: this.state.topics[subjectid].length + 1,
    });
    if (ok) {
      this.getSubjectTopics(subjectid);
    }
  }

  getActiveFiltersFromUrl() {
    const {
      location: { search },
    } = this.props;
    const { filters } = queryString.parse(search);
    return filters ? filters.split(',') : [];
  }

  async getAllSubjects() {
    try {
      const subjects = await fetchSubjects(this.props.locale);
      this.setState({ subjects });
    } catch (e) {
      handleError(e);
    }
  }

  async getSubjectTopics(subjectid) {
    try {
      const allTopics = await fetchSubjectTopics(subjectid);
      const groupedTopics = groupTopics(allTopics);

      this.setState(prevState => ({
        topics: {
          ...prevState.topics,
          [subjectid]: groupedTopics,
        },
      }));
    } catch (e) {
      handleError(e);
    }
  }

  getCurrentTopic() {
    const {
      match: {
        params: { subject, topic1, topic2, topic3 },
      },
    } = this.props;
    if (topic1) {
      const sub = this.state.topics[`urn:${subject}`];
      let topic = sub ? sub.find(top => top.id === `urn:${topic1}`) : {};
      if (topic2) {
        topic = topic.topics
          ? topic.topics.find(top => top.id === `urn:${topic2}`)
          : {};
        if (topic3) {
          topic = topic.topics
            ? topic.topics.find(top => top.id === `urn:${topic3}`)
            : {};
        }
      }
      return topic || {};
    }
    return {};
  }

  async getFilters(subjectId = `urn:${this.props.match.params.subject}`) {
    try {
      const filters = await fetchSubjectFilters(subjectId);
      this.setState({ filters });
    } catch (e) {
      handleError(e);
    }
  }

  async setPrimary(subjectId) {
    const connection = this.state.activeConnections.find(conn =>
      conn.paths.some(path => path.includes(subjectId.replace('urn:', ''))),
    );

    if (connection.connectionId.includes('topic-subtopic')) {
      const ok = await updateTopicSubtopic(connection.connectionId, {
        id: connection.targetId,
        primary: true,
      });
      if (ok) this.deleteConnections();
    } else {
      const ok = await updateSubjectTopic(connection.connectionId, {
        id: connection.targetId,
        primary: true,
      });
      if (ok) this.deleteConnections();
    }
  }

  async addSubject(name) {
    const newPath = await addSubject({ name });
    this.getAllSubjects();
    return newPath;
  }

  deleteConnections() {
    this.state.jsPlumbConnections.forEach(({ instance, connection }) => {
      instance.deleteConnection(connection);
    });
    this.setState({ jsPlumbConnections: [], activeConnections: [] });
  }

  async deleteTopicLink(subjectId) {
    const { activeConnections } = this.state;
    const connectionToDelete = activeConnections.find(conn =>
      conn.paths.some(path => path.includes(subjectId.replace('urn:', ''))),
    );
    const { connectionId } = connectionToDelete;
    try {
      if (connectionId.includes('topic-subtopic')) {
        await deleteSubTopicConnection(connectionId);
      } else {
        await deleteTopicConnection(connectionId);
      }
      this.getSubjectTopics(subjectId);
    } catch (e) {
      handleError(e);
    }
  }

  async showLink(id, parent) {
    if (this.state.jsPlumbConnections.length > 0) {
      this.deleteConnections();
    } else {
      const connectionArray = await fetchTopicConnections(id);

      const uniqueId = parent ? `${parent}/${id}` : id;
      const connections = connectLinkItems(
        uniqueId,
        connectionArray,
        parent,
        this.props.match.params.subject,
        this,
      );
      this.setState({
        jsPlumbConnections: connections,
        activeConnections: connectionArray,
      });
    }
  }

  refFunc(element, id) {
    this[id] = element;
  }

  toggleFilter(filterId) {
    const activeFilters = this.getActiveFiltersFromUrl();
    const { history } = this.props;
    if (activeFilters.find(id => id === filterId)) {
      history.push({
        search: `?filters=${activeFilters
          .filter(id => id !== filterId)
          .join(',')}`,
      });
    } else {
      history.push({
        search: `?filters=${[...activeFilters, filterId].join(',')}`,
      });
    }
  }

  render() {
    const { match, t, locale } = this.props;
    const {
      topics,
      filters,
      jsPlumbConnections,
      subjects,
      editStructureHidden,
    } = this.state;
    const activeFilters = this.getActiveFiltersFromUrl();
    const { params } = match;
    const topicId = params.topic3 || params.topic2 || params.topic1;
    const currentTopic = this.getCurrentTopic();

    return (
      <ErrorBoundary>
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
            hidden={editStructureHidden}>
            <div id="plumbContainer">
              {subjects.map(subject => (
                <FolderItem
                  {...subject}
                  refFunc={this.refFunc}
                  key={subject.id}
                  topics={topics[subject.id]}
                  active={subject.id.replace('urn:', '') === params.subject}
                  match={match}
                  onChangeSubjectName={this.onChangeSubjectName}
                  onAddSubjectTopic={this.onAddSubjectTopic}
                  showLink={this.showLink}
                  onAddExistingTopic={this.onAddExistingTopic}
                  refreshTopics={() => this.getSubjectTopics(subject.id)}
                  linkViewOpen={jsPlumbConnections.length > 0}
                  getFilters={this.getFilters}
                  subjectFilters={filters}
                  activeFilters={activeFilters}
                  toggleFilter={this.toggleFilter}
                  setPrimary={this.setPrimary}
                  deleteTopicLink={this.deleteTopicLink}
                />
              ))}
              <div
                style={{
                  display: jsPlumbConnections.length > 0 ? 'block' : 'none',
                }}
                ref={this.starButton}>
                <RoundIcon icon={<Star />} />
              </div>
            </div>
          </Accordion>
          {topicId && (
            <StructureResources
              locale={locale}
              params={params}
              activeFilters={activeFilters}
              currentTopic={currentTopic}
              refreshTopics={() =>
                this.getSubjectTopics(`urn:${params.subject}`)
              }
            />
          )}
        </OneColumn>
      </ErrorBoundary>
    );
  }
}

StructurePage.propTypes = {
  locale: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subject: PropTypes.string,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default compose(
  injectT,
  connect(
    mapStateToProps,
    null,
  ),
)(StructurePage);
