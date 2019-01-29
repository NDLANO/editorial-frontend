/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@ndla/i18n';
import Button from '@ndla/button';
import { Link } from 'react-router-dom';
import { spacing } from '@ndla/core';
import { css } from 'emotion';
import { fetchDraft, updateDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import Row from '../../components/Row';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../util/articleContentConverter';

const MonacoEditor = React.lazy(() => import('../../components/MonacoEditor'));

// Serialize and deserialize content using slate helpers
// to ensure standarized markup.
// Also useful for detecting validatio issues.
function standardizeContent(content) {
  const converted = learningResourceContentToEditorValue(content);
  return learningResourceContentToHTML(converted);
}

export class EditMarkupPage extends Component {
  state = {
    // initial | loading | edit | fetch-error | save-error | saving
    status: 'initial',
    draft: undefined,
  };

  async componentDidMount() {
    try {
      this.setState({ status: 'loading' });
      const { draftId, language } = this.props.match.params;
      const draft = await fetchDraft(draftId, language);
      this.setState({ draft, status: 'edit' });
    } catch (e) {
      handleError(e);
      this.setState({ status: 'fetch-error' });
    }
  }

  saveChanges = async () => {
    try {
      const { draftId, language } = this.props.match.params;
      this.setState({ status: 'saving' });
      const content = standardizeContent(this.state.draft.content.content);
      const draft = await updateDraft({
        id: parseInt(draftId, 10),
        content,
        revision: this.state.draft.revision,
        language,
      });
      this.setState({ status: 'edit', draft });
    } catch (e) {
      handleError(e);
      this.setState({ status: 'save-error' });
    }
  };

  handleChange = (value, event) => {
    this.setState(prevState => ({
      draft: {
        ...prevState.draft,
        content: { ...prevState.draft.content, content: value },
      },
    }));
  };

  render() {
    const { draftId, language } = this.props.match.params;
    const { status, draft } = this.state;
    if (status === 'fetch-error') {
      return <p>Kunne ikke laste artikkel</p>;
    }

    return (
      <Trans>
        {({ t }) => (
          <Fragment>
            <div
              css={{
                minHeight: '80vh',
                padding: '15px',
                margin: '0 auto',
                maxWidth: '1000px',
              }}>
              <Suspense fallback={<div>Loading...</div>}>
                <MonacoEditor
                  key={draft ? draft.id + draft.revision : 'draft'}
                  value={draft ? draft.content.content : ''}
                  onChange={this.handleChange}
                />
              </Suspense>
              <Row
                justifyContent="end"
                alignItems="baseline"
                css={css`
                  margin-top: ${spacing.normal};
                `}>
                <Link
                  to={`/subject-matter/learning-resource/${draftId}/edit/${language}`}>
                  Tilbake
                </Link>
                <Button onClick={this.saveChanges}>Lagre</Button>
              </Row>
            </div>
          </Fragment>
        )}
      </Trans>
    );
  }
}

EditMarkupPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      draftId: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
    }),
  }),
};

export default EditMarkupPage;
