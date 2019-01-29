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
import { fetchDraft, updateDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';

const MonacoEditor = React.lazy(() => import('../../components/MonacoEditor'));

export class EditMarkupPage extends Component {
  state = {
    // initial | loading | edit | error | saving
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
      this.setState({ status: 'error' });
    }
  }

  saveChanges = async () => {
    try {
      const { draftId, language } = this.props.match.params;
      this.setState({ status: 'saving' });
      await updateDraft({
        id: parseInt(draftId, 10),
        content: this.state.draft.content.content,
        revision: this.state.draft.revision,
        language,
      });
      this.setState({ status: 'edit' });
    } catch (e) {
      handleError(e);
      this.setState({ status: 'error' });
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
    const { status, draft } = this.state;
    if (status === 'error') {
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
              <div css={{ float: 'left' }}>
                <Link to={`subject-matter`}>Tilbake</Link>
              </div>
              <Suspense fallback={<div>Loading...</div>}>
                {status === 'edit' && (
                  <MonacoEditor
                    key={draft.id}
                    value={draft.content.content}
                    onChange={this.handleChange}
                  />
                )}
              </Suspense>
              <Button
                onClick={this.saveChanges}
                css={{
                  marginTop: spacing.small,
                  float: 'right',
                }}>
                Lagre
              </Button>
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
