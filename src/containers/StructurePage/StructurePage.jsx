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
import { OneColumn } from 'ndla-ui';
import { Taxonomy } from 'ndla-icons/editor';
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
  addSubjectTopic,
} from '../../modules/taxonomy';

export class StructurePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editStructureHidden: false,
      subjects: [],
      topics: {},
    };
    this.getAllSubjects = this.getAllSubjects.bind(this);
    this.getSubjectTopics = this.getSubjectTopics.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.onChangeSubjectName = this.onChangeSubjectName.bind(this);
    this.onAddSubjectTopic = this.onAddSubjectTopic.bind(this);
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
    const id = `urn:${nextProps.match.params.subject}`;
    const currentSub = this.state.subjects.find(it => it.id === id);
    if (id && currentSub && !this.state.topics[id]) {
      this.getSubjectTopics(id);
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
    const subjects = await fetchSubjects(this.props.locale);
    this.setState({ subjects });
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
    const { match: { params }, t, locale } = this.props;

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
              onChangeSubjectName={this.onChangeSubjectName}
              onAddSubjectTopic={this.onAddSubjectTopic}
              onAddExistingTopic={this.onAddExistingTopic}
            />
          ))}
        </Accordion>
        <StructureResources {...{ locale, params }} />
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
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default compose(injectT, connect(mapStateToProps, null))(StructurePage);
