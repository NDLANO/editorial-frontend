import React, { PureComponent } from 'react';
import { injectT } from '@ndla/i18n';
import * as conceptApi from '../../../src/modules/concept/conceptApi';
import handleError from '../../util/handleError';
import { async } from 'q';
import FieldHeader from '@ndla/forms/lib/FieldHeader';
import { getTimeSinceLastZoomLevelChanged } from 'monaco-editor/esm/vs/base/browser/browser';
import { Input } from '@ndla/forms';
import { OneColumn } from '@ndla/ui';
import ConceptForm from './ConceptForm';

class ConceptPage extends PureComponent {
  state = {
    //concepts: [],
  };

  async componentDidMount() {
    try {
      const concept = await conceptApi.fetchConcept(3, 'nb');
      // const allConcepts = await this.fetchAllConcepts();
      //console.log(allConcepts);
      //  this.setState({
      //    concept,
      //  });
    } catch (err) {
      handleError(err);
    }
  }

  /*fetchAllConcepts = async () => {
    const query = {
      page: 1,
      subjects: 'urn:subject:20',
      'context-types': 'topic-article',
      sort: '-relevance',
      'page-size': 100,
    };
    const response = await searchResources(query);
    return response.results;
  };*/

  /* fetchAllConcepts = async () => {
        const query = {
          page: 1,
          subjects: 'urn:subject:20',
          'context-types': 'topic-article',
          sort: '-relevance',
          'page-size': 100,
        };
        const response = await searchResources(query);
        return response.results;
      };*/

  render() {
    const { concept } = this.state;
    //console.log(concept);
    //this.onAddConcept('tytyt', 'Beskrivelgggse av konsept ye', 'nb');

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p>{concept ? concept.title.language : ''}</p>
        <OneColumn>
          <h1>Legg til nytt begrep</h1>
          <ConceptForm />
        </OneColumn>
      </div>
    );
  }
}

export default injectT(ConceptPage);