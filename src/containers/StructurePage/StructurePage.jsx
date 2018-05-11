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
import { jsPlumb } from 'jsplumb';

import { getLocale } from '../../modules/locale/locale';
import StructureResources from './StructureResources';
import FolderItem from './components/FolderItem';
import InlineAddButton from './components/InlineAddButton';
import Accordion from '../../components/Accordion';
import {
  fetchSubjects,
  fetchSubjectTopics,
  addSubject,
  addTopic,
  updateSubjectName,
  fetchSubjectFilters,
  addSubjectTopic,
} from '../../modules/taxonomy';
import RoundIcon from './components/RoundIcon';

export class StructurePage extends React.PureComponent {
  constructor(props) {
    super(props);
    const activeFilters =
      queryString.parse(props.location.search).filters || '';
    this.state = {
      editStructureHidden: false,
      subjects: [],
      topics: {},
      filters: [],
      activeFilters: activeFilters.split(','),
      connections: [],
    };
    this.starButton = React.createRef();
    this.plumbContainer = React.createRef();
    this.getAllSubjects = this.getAllSubjects.bind(this);
    this.getSubjectTopics = this.getSubjectTopics.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.onChangeSubjectName = this.onChangeSubjectName.bind(this);
    this.onAddSubjectTopic = this.onAddSubjectTopic.bind(this);
    this.showLink = this.showLink.bind(this);
    this.refFunc = this.refFunc.bind(this);
    this.connectLinkItems = this.connectLinkItems.bind(this);
    this.deleteConnections = this.deleteConnections.bind(this);
    this.onAddExistingTopic = this.onAddExistingTopic.bind(this);
    this.getFilters = this.getFilters.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
  }

  componentDidMount() {
    this.getAllSubjects();
    const { subject } = this.props.match.params;
    if (subject) {
      this.getSubjectTopics(`urn:${subject}`);
      this.getFilters(`urn:${subject}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location: { pathname, search }, match: { params } } = nextProps;
    if (pathname !== this.props.location.pathname) {
      this.deleteConnections();
      const { subject } = params;
      if (subject) {
        this.getFilters(`urn:${subject}`);
      }
      const currentSub = this.state.subjects.find(
        sub => sub.id === `urn:${subject}`,
      );
      if (currentSub && !this.state.topics[`urn:${subject}`]) {
        this.getSubjectTopics(`urn:${subject}`);
      }
    }
    if (search !== this.props.location.search) {
      const { filters } = queryString.parse(search);
      this.setState({
        activeFilters: filters ? filters.split(',') : [],
      });
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

  async onAddExistingTopic(subjectid, topicid) {
    try {
      const ok = await addSubjectTopic({
        subjectid,
        topicid,
      });
      if (ok) {
        this.getSubjectTopics(subjectid);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onAddSubjectTopic(subjectid, name) {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  async getAllSubjects() {
    try {
      const subjects = await fetchSubjects(this.props.locale);
      subjects.forEach(subject => {
        this[subject.id] = React.createRef();
      });
      this.setState({ subjects });
    } catch (e) {
      console.log(e);
    }
  }

  async getSubjectTopics(subjectid) {
    try {
      const allTopics = await fetchSubjectTopics(subjectid);
      const insertSubTopic = (topics, subTopic) =>
        topics.map(topic => {
          if (topic.id === subTopic.parent) {
            return {
              ...topic,
              topics: [...(topic.topics || []), subTopic],
            };
          } else if (topic.topics) {
            return {
              ...topic,
              topics: insertSubTopic(topic.topics, subTopic),
            };
          }
          return topic;
        });

      const groupedTopics = allTopics.reduce((acc, curr) => {
        const mainTopic = curr.parent.includes('subject');
        if (mainTopic) return acc;
        return insertSubTopic(acc.filter(topic => topic.id !== curr.id), curr);
      }, allTopics);

      this.setState(prevState => ({
        topics: {
          ...prevState.topics,
          [subjectid]: groupedTopics,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async getFilters(subjectId = `urn:${this.props.match.params.subject}`) {
    try {
      const filters = await fetchSubjectFilters(subjectId);
      this.setState({ filters });
    } catch (e) {
      console.log(e);
    }
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

  connectLinkItems(source, target) {
    const instance = jsPlumb.getInstance({
      Container: this.plumbContainer.current,
    });
    return instance.connect({
      source: this[source],
      target: this[target],
      endpoint: 'Blank',
      connector: ['Flowchart', { stub: 50 }],
      paintStyle: { strokeWidth: 1, stroke: '#000000', dashstyle: '4 2' },
      anchors: ['Left', 'Left'],
      overlays: [
        ['Custom', { create: () => this.starButton.current, location: 70 }],
        [
          'Custom',
          { create: () => this[`linkButton-${target}`], location: -30 },
        ],
      ],
    });
  }

  deleteConnections() {
    this.state.connections.forEach(conn => {
      jsPlumb.deleteConnection(conn);
    });
    this.setState({ connections: [] });
  }

  showLink(id) {
    const target = this.state.subjects[0].id;
    const target2 = this.state.subjects[this.state.subjects.length - 1].id;
    if (this.state.connections.length > 0) {
      this.deleteConnections();
    } else {
      this.starButton.current.style.display = 'block';
      this[`linkButton-${target}`].style.display = 'block';
      this[`linkButton-${target2}`].style.display = 'block';
      const connection1 = this.connectLinkItems(id, target);
      const connection2 = this.connectLinkItems(id, target2);
      this.setState({ connections: [connection1, connection2] });
    }
  }

  refFunc(element, id) {
    this[id] = element;
  }

  toggleFilter(filterId) {
    const { activeFilters } = this.state;
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
      activeFilters,
      topics,
      filters,
      connections,
      subjects,
    } = this.state;
    const { params } = match;
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
          <div ref={this.plumbContainer}>
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
                linkViewOpen={connections.length > 0}
                getFilters={this.getFilters}
                filters={filters}
                activeFilters={activeFilters}
                toggleFilter={this.toggleFilter}
              />
            ))}
          </div>
        </Accordion>
        {(params.topic1 || params.topic2 || params.topic3) && (
          <StructureResources
            locale={locale}
            params={params}
            activeFilters={activeFilters}
          />
        )}
        <div style={{ display: 'none' }} ref={this.starButton}>
          <RoundIcon icon={<Star />} />
        </div>
      </OneColumn>
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

export default compose(injectT, connect(mapStateToProps, null))(StructurePage);
