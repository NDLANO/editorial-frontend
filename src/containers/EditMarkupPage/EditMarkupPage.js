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
import { fetchDraft, updateDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';

const MonacoEditor = React.lazy(() => import('../../components/MonacoEditor'));

export class EditMarkupPage extends Component {
  state = {
    // initial | loading | loaded | error | saving | saved
    status: 'initial',
    draft: undefined,
  };

  async componentDidMount() {
    try {
      console.log(this.props);
      this.setState({ status: 'loading' });
      const { draftId, language } = this.props.match.params;
      const draft = await fetchDraft(draftId, language);
      this.setState({ draft, status: 'loaded' });
    } catch (e) {
      handleError(e);
      this.setState({ status: 'error' });
    }
  }

  saveChanges = async () => {
    try {
      this.setState({ status: 'saving' });
      await updateDraft(this.state.draft);
      this.setState({ status: 'saved' });
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
            <div css={{ float: 'right' }}>
              <Link to={`subject-matter`}>Tilbake</Link>
            </div>
            <div
              css={{
                minHeight: '80vh',
                padding: '15px',
                margin: '0 auto',
                maxWidth: '800px',
              }}>
              <Suspense fallback={<div>Loading...</div>}>
                {status === 'loaded' && (
                  <MonacoEditor
                    key={draft.id}
                    value={draft.content.content}
                    onChange={this.handleChange}
                  />
                )}
              </Suspense>
            </div>
            <Button onClick={this.saveChanges}>Lagre</Button>
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
