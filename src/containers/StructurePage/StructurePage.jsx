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
import { Taxonomy } from 'ndla-icons/editor';
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
import Overlay from '../../components/Overlay';

export class StructurePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editStructureHidden: false,
      subjects: [],
      toggles: {},
      loading: false,
    };
    this.toggleState = this.toggleState.bind(this);
    this.getAllSubjects = this.getAllSubjects.bind(this);
    this.getSubjectTopics = this.getSubjectTopics.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.onChangeSubjectName = this.onChangeSubjectName.bind(this);
    this.onAddSubjectTopic = this.onAddSubjectTopic.bind(this);
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
    if (id && currentSub && !currentSub.topics) {
      this.getSubjectTopics(id);
    }
  }

  async onChangeSubjectName(subjectId, name) {
    this.setState({ loading: true });
    try {
      const ok = await updateSubjectName(subjectId, name);
      if (ok) {
        this.setState(prevState => ({
          loading: false,
          toggles: {},
          subjects: prevState.subjects.map(subject => {
            if (subject.id === subjectId) {
              return {
                ...subject,
                name,
              };
            }
            return subject;
          }),
        }));
      }
    } catch (e) {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
    return new Promise(resolve => resolve());
  }

  async onAddSubjectTopic(id, name) {
    this.setState({ loading: true });
    const newPath = await addTopic({ name });
    const newId = newPath.replace('/v1/topics/', '');
    const ok = await addSubjectTopic({
      subjectid: id,
      topicid: newId,
      primary: true,
    });
    if (ok) {
      this.setState(prevState => ({
        loading: false,
        toggles: {},
        subjects: prevState.subjects.map(
          subject =>
            subject.id !== id
              ? subject
              : {
                  ...subject,
                  topics: [
                    ...subject.topics,
                    {
                      name,
                      path: `/${id}/${newId}`,
                      id: newId,
                    },
                  ],
                },
        ),
      }));
    }
  }

  async getAllSubjects() {
    const subjects = await fetchSubjects();
    this.setState({ subjects });
  }

  async getSubjectTopics(id) {
    const allTopics = await fetchSubjectTopics(id);
    const mainTopics = allTopics.filter(it => it.parent === id);
    const groupedTopics = mainTopics.map(topic => ({
      ...topic,
      topics: allTopics.filter(it => it.parent === topic.id),
    }));

    this.setState(prevState => ({
      subjects: prevState.subjects.map(
        subject =>
          subject.id !== id
            ? subject
            : {
                ...subject,
                topics: groupedTopics,
              },
      ),
    }));
  }

  toggleState(item) {
    this.setState(prevState => ({
      toggles: {
        [item]: !prevState.toggles[item],
      },
    }));
  }

  async addSubject(name) {
    this.setState({ loading: true });
    const newPath = await addSubject({ name });

    if (typeof newPath === 'string') {
      this.setState(prevState => ({
        loading: false,
        subjects: [
          ...prevState.subjects,
          {
            name,
            path: newPath,
            id: newPath.replace('/v1/subjects/', ''),
          },
        ],
      }));
    }
  }

  render() {
    const { match: { params }, t } = this.props;
    return (
      <OneColumn>
        {this.state.loading && (
          <React.Fragment>
            <Overlay cssModifiers={['white-opacity']} />
          </React.Fragment>
        )}
        <Accordion
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
          handleToggle={() => this.toggleState('editStructureHidden')}
          hidden={this.state.editStructureHidden}>
          {this.state.subjects.map(it => (
            <FolderItem
              {...it}
              key={it.id}
              toggleState={this.toggleState}
              toggles={this.state.toggles}
              active={it.id.replace('urn:', '') === params.subject}
              params={params}
              t={t}
              onChangeSubjectName={this.onChangeSubjectName}
              onAddSubjectTopic={this.onAddSubjectTopic}
            />
          ))}
        </Accordion>
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
};

export default injectT(StructurePage);
