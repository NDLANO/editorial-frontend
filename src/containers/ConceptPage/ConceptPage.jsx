import React, { PureComponent } from 'react';
import { injectT } from '@ndla/i18n';
import * as conceptApi from '../../../src/modules/concept/conceptApi';
import handleError from '../../util/handleError';
import { async } from 'q';
import FieldHeader from '@ndla/forms/lib/FieldHeader';
import { getTimeSinceLastZoomLevelChanged } from 'monaco-editor/esm/vs/base/browser/browser';
import { Input } from '@ndla/forms';

class ConceptPage extends PureComponent {
  state = {
    concepts: [],
    title: undefined,
    content: undefined,
  };

  async componentDidMount() {
    try {
      const concept = await conceptApi.fetchConcept(3, 'nb');
      // const allConcepts = await this.fetchAllConcepts();
      //console.log(allConcepts);
      this.setState({
        concept,
      });
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

  onAddConcept = (conceptTitle, conceptContent, language) => {
    const newConcept = {
      title: conceptTitle,
      content: conceptContent,
      language: language,
    };

    this.setState(prevState => ({
      concepts: [...prevState.concepts, newConcept],
    }));
    conceptApi.addConcept(newConcept);
  };

  titleChanged = event => {
    this.setState({ title: event.target.value });
    console.log("title changed");
  };

  contentChanged = event => {
    this.setState({ content: event.target.value });
    console.log("content changed");
  };

  handleSubmit = event => {
    this.onAddConcept(this.state.title, this.state.content, 'nb');
    //this.setState({ title: undefined, content: undefined });
    console.log(this.state.title);
    event.preventDefault();
  };
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
        <h1>Concept</h1>
        <p>{concept ? concept.title.title : ''}</p>

        <FieldHeader title={'Legg til nytt begrep'} width={0.5} />
      {/* <Input type="text" onChange={e => handleContributorChange(e)} /> */}

        <form onSubmit={this.handleSubmit}>
          <label>
            Begrep:
            <input
              type="text"
              name="title"
              value={this.state.value}
              onChange={this.titleChanged}
            />
          </label>
          <label>
            Forklaring:
            <input
              type="text"
              name="content"
              value={this.state.value}
              onChange={this.contentChanged}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default injectT(ConceptPage);
