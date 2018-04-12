/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { OneColumn } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { Taxonomy, Star } from 'ndla-icons/editor';
import { jsPlumb } from 'jsplumb';

import FolderItem from './components/FolderItem';
import InlineAddButton from './components/InlineAddButton';
import Accordion from '../../components/Accordion';
import {
  fetchSubjects,
  fetchSubjectTopics,
  addSubject,
  addTopic,
  updateSubjectName,
  addSubjectTopic,
} from '../../modules/taxonomy';
import RoundIcon from './components/RoundIcon';

export class StructurePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editStructureHidden: false,
      subjects: [],
      topics: {},
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
  }

  componentDidMount() {
    this.getAllSubjects();
    const id = this.props.match.params.subject;
    if (id) {
      this.getSubjectTopics(`urn:${id}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.deleteConnections();
      const id = `urn:${nextProps.match.params.subject}`;
      const currentSub = this.state.subjects.find(it => it.id === id);
      if (id && currentSub && !this.state.topics[id]) {
        this.getSubjectTopics(id);
      }
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
    });
    if (ok) {
      this.getSubjectTopics(subjectid);
    }
  }

  async getAllSubjects() {
    const subjects = await fetchSubjects();
    subjects.forEach(subject => {
      this[subject.id] = React.createRef();
    });
    this.setState({ subjects });
  }

  async getSubjectTopics(subjectid) {
    const allTopics = await fetchSubjectTopics(subjectid);
    const mainTopics = allTopics.filter(it => it.parent === subjectid);
    const groupedTopics = mainTopics.map(topic => ({
      ...topic,
      topics: allTopics.filter(it => it.parent === topic.id),
    }));

    allTopics.forEach(topic => {
      this[topic.id] = React.createRef();
    });
    this.setState(prevState => ({
      topics: {
        ...prevState.topics,
        [subjectid]: groupedTopics,
      },
    }));
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
  e;

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
          <div ref={this.plumbContainer}>
            {this.state.subjects.map(it => (
              <FolderItem
                {...it}
                refFunc={this.refFunc}
                key={it.id}
                topics={this.state.topics[it.id]}
                active={it.id.replace('urn:', '') === params.subject}
                params={params}
                onChangeSubjectName={this.onChangeSubjectName}
                onAddSubjectTopic={this.onAddSubjectTopic}
                showLink={this.showLink}
                onAddExistingTopic={this.onAddExistingTopic}
                linkViewOpen={this.state.connections.length > 0}
              />
            ))}
          </div>
        </Accordion>
        <div style={{ display: 'none' }} ref={this.starButton}>
          <RoundIcon icon={<Star />} />
        </div>
      </OneColumn>
    );
  }
}

StructurePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subject: PropTypes.string,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default injectT(StructurePage);
