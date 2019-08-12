/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { injectT } from '@ndla/i18n';
import { OneColumn } from '@ndla/ui';
import { withRouter } from 'react-router-dom';
import { Taxonomy, Star } from '@ndla/icons/editor';
import { Structure } from '@ndla/editor';
import { connectLinkItems } from '../../util/jsPlumbHelpers';
import handleError from '../../util/handleError';
import { getLocale } from '../../modules/locale/locale';
import StructureResources from './resourceComponents/StructureResources';
import FolderItem from './folderComponents/FolderItem';
import {
  removeLastItemFromUrl,
  getPathsFromUrl,
} from '../../util/routeHelpers';
import InlineAddButton from '../../components/InlineAddButton';
import Accordion from '../../components/Accordion';
import ErrorBoundary from '../../components/ErrorBoundary';
import {
  fetchSubjects,
  fetchSubjectTopics,
  addSubject,
  fetchSubjectFilters,
  fetchTopicConnections,
  updateTopicSubtopic,
  updateSubjectTopic,
  deleteTopicConnection,
  deleteSubTopicConnection,
} from '../../modules/taxonomy';
import { groupTopics, getCurrentTopic } from '../../util/taxonomyHelpers';
import RoundIcon from '../../components/RoundIcon';
import config from '../../config';
import Footer from '../App/components/Footer';
import { LocationShape, HistoryShape } from '../../shapes';

export class StructureContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editStructureHidden: false,
      subjects: [],
      filters: {},
      jsPlumbConnections: [],
      activeConnections: [],
    };
    this.starButton = React.createRef();
    this.resourceSection = React.createRef();
    this.getAllSubjects = this.getAllSubjects.bind(this);
    this.getSubjectTopics = this.getSubjectTopics.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.showLink = this.showLink.bind(this);
    this.refFunc = this.refFunc.bind(this);
    this.deleteConnections = this.deleteConnections.bind(this);
    this.getFilters = this.getFilters.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.setPrimary = this.setPrimary.bind(this);
    this.getActiveFiltersFromUrl = this.getActiveFiltersFromUrl.bind(this);
    this.saveSubjectItems = this.saveSubjectItems.bind(this);
    this.deleteTopicLink = this.deleteTopicLink.bind(this);
    this.refreshTopics = this.refreshTopics.bind(this);
    this.toggleStructure = this.toggleStructure.bind(this);
    this.handleStructureToggle = this.handleStructureToggle.bind(this);
  }

  async componentDidMount() {
    await this.getAllSubjects();
    const { subject } = this.props.match.params;
    if (subject) {
      this.getSubjectTopics(subject);
      this.getFilters();
    }
  }

  componentDidUpdate({
    match: {
      params: { subject: prevSubject },
    },
    location: { pathname: prevPathname },
  }) {
    const { subjects } = this.state;
    const {
      location: { pathname },
      match: { params },
      history,
    } = this.props;
    if (pathname !== prevPathname) {
      this.deleteConnections();
      const { subject } = params;
      if (subject) {
        this.getFilters();
      }
      if (!subject || subject !== prevSubject) {
        history.push({
          search: '',
        });
      }
      const currentSub = subjects.find(sub => sub.id === subject);
      if (currentSub && !currentSub.topics) {
        this.getSubjectTopics(subject);
      }
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
      this.setState({
        subjects: subjects.sort((a, b) => a.name.localeCompare(b.name)),
      });
    } catch (e) {
      handleError(e);
    }
  }

  async getSubjectTopics(subjectid) {
    try {
      this.saveSubjectItems(subjectid, { loading: true });
      const allTopics = await fetchSubjectTopics(subjectid);
      const topics = groupTopics(allTopics);
      this.saveSubjectItems(subjectid, { topics, loading: false });
    } catch (e) {
      handleError(e);
    }
  }

  saveSubjectItems(subjectid, saveItems) {
    this.setState(prevState => ({
      subjects: prevState.subjects.map(subject => {
        if (subject.id === subjectid)
          return {
            ...subject,
            ...saveItems,
          };
        return subject;
      }),
    }));
  }

  async getFilters() {
    const { subject } = this.props.match.params;
    try {
      const filters = await fetchSubjectFilters(subject);
      this.setState(prevState => ({
        filters: {
          ...prevState.filters,
          [subject]: filters,
        },
      }));
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
      this.deleteConnections();
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

  refreshTopics() {
    const {
      match: { params },
    } = this.props;
    this.getSubjectTopics(params.subject);
  }

  toggleStructure() {
    this.setState(prevState => ({
      editStructureHidden: !prevState.editStructureHidden,
    }));
  }

  handleStructureToggle({ path }) {
    const {
      location: { search },
      history,
      match,
    } = this.props;
    const currentPath = match.url.replace('/structure/', '');
    const levelAbove = removeLastItemFromUrl(currentPath);
    const newPath = currentPath === path ? levelAbove : path;
    history.push(`/structure/${newPath.concat(search)}`);
  }

  render() {
    const { match, t, locale } = this.props;
    const {
      filters,
      jsPlumbConnections,
      subjects,
      editStructureHidden,
    } = this.state;
    const activeFilters = this.getActiveFiltersFromUrl();
    const { params } = match;
    const topicId = params.topic3 || params.topic2 || params.topic1;
    const currentSubject = subjects.find(sub => sub.id === params.subject);
    const currentTopic = getCurrentTopic({
      params,
      subject: currentSubject,
    });
    const linkViewOpen = jsPlumbConnections.length > 0;

    return (
      <ErrorBoundary>
        <OneColumn>
          <Accordion
            handleToggle={this.toggleStructure}
            header={
              <React.Fragment>
                <Taxonomy className="c-icon--medium" />
                {t('taxonomy.editStructure')}
              </React.Fragment>
            }
            appearance="taxonomy"
            addButton={
              config.enableFullTaxonomy && (
                <InlineAddButton
                  title={t('taxonomy.addSubject')}
                  action={this.addSubject}
                />
              )
            }
            hidden={editStructureHidden}>
            <div id="plumbContainer">
              <Structure
                openedPaths={getPathsFromUrl(match.url)}
                structure={subjects}
                filters={filters}
                toggleOpen={this.handleStructureToggle}
                activeFilters={activeFilters}
                highlightMainActive
                renderListItems={listProps => (
                  <FolderItem
                    refFunc={this.refFunc}
                    {...listProps}
                    getAllSubjects={this.getAllSubjects}
                    onAddSubjectTopic={this.onAddSubjectTopic}
                    showLink={this.showLink}
                    subjectFilters={filters[params.subject]}
                    onAddExistingTopic={this.onAddExistingTopic}
                    refreshTopics={this.refreshTopics}
                    linkViewOpen={linkViewOpen}
                    getFilters={this.getFilters}
                    activeFilters={activeFilters}
                    setPrimary={this.setPrimary}
                    toggleFilter={this.toggleFilter}
                    deleteTopicLink={this.deleteTopicLink}
                    jumpToResources={() =>
                      this.resourceSection &&
                      this.resourceSection.current.scrollIntoView()
                    }
                    locale={locale}
                  />
                )}
              />
              <div ref={this.starButton}>
                {linkViewOpen && <RoundIcon icon={<Star />} />}
              </div>
            </div>
          </Accordion>
          {topicId && (
            <StructureResources
              locale={locale}
              params={params}
              resourceRef={this.resourceSection}
              activeFilters={activeFilters}
              currentTopic={currentTopic}
              currentSubject={currentSubject}
              refreshTopics={this.refreshTopics}
            />
          )}
        </OneColumn>
        <Footer showLocaleSelector />
      </ErrorBoundary>
    );
  }
}

StructureContainer.propTypes = {
  locale: PropTypes.string,
  match: PropTypes.shape({
    url: PropTypes.string,
    params: PropTypes.shape({
      subject: PropTypes.string,
      topic1: PropTypes.string,
      topic2: PropTypes.string,
      topic3: PropTypes.string,
    }).isRequired,
  }).isRequired,
  location: LocationShape,
  history: HistoryShape,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default withRouter(
  injectT(connect(mapStateToProps)(StructureContainer)),
);
