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
import { Taxonomy } from 'ndla-icons/editor';
import FolderItem from './components/FolderItem';
import InlineAddButton from './components/InlineAddButton';
import Accordion from '../../components/Accordion';
import { fetchSubjects, addSubject } from '../../modules/taxonomy/taxonomyApi';

class StructurePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editStructureHidden: false,
      subjects: [],
      loadingSubjects: false,
    };
    this.toggleState = this.toggleState.bind(this);
    this.getAllSubjects = this.getAllSubjects.bind(this);
    this.addSubject = this.addSubject.bind(this);
  }

  componentDidMount() {
    this.getAllSubjects();
  }

  async getAllSubjects() {
    const subjects = await fetchSubjects();
    console.log(subjects);
    this.setState({ subjects });
  }

  toggleState(item) {
    this.setState(prevState => ({
      [item]: !prevState[item],
    }));
  }

  async addSubject(name) {
    this.setState({ loadingSubjects: true });
    const newPath = await addSubject({ name });
    this.setState({ loadingSubjects: false });
    if (newPath) {
      this.setState(prevState => ({
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
    const { match: { params } } = this.props;
    return (
      <OneColumn>
        <Accordion
          header={
            <React.Fragment>
              <Taxonomy className="c-icon--medium" />
              {'  Rediger struktur'}
            </React.Fragment>
          }
          taksonomi
          addButton={
            <InlineAddButton
              title="+ Legg til nytt fag"
              action={this.addSubject}
            />
          }
          handleToggle={() => this.toggleState('editStructureHidden')}
          hidden={this.state.editStructureHidden}>
          {this.state.subjects.map(it => (
            <FolderItem
              key={it.id}
              title={it.name}
              active={it.id === params.subject}
              path={`/struktur/${it.id}`}
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

export default StructurePage;
