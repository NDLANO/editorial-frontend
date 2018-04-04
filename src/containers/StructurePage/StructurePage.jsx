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
import { fetchSubjects, addSubject } from '../../modules/taxonomy/taxonomyApi';

export class StructurePage extends React.PureComponent {
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
    if (typeof newPath === 'string') {
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
    const { match: { params }, t } = this.props;
    return (
      <OneColumn>
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
              key={it.id}
              title={it.name}
              active={it.id === params.subject}
              path={`/structure/${it.id}`}
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
