/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@ndla/i18n';
import Button from '@ndla/button';
import { Link } from 'react-router-dom';
import { spacing, colors } from '@ndla/core';
import styled, { css } from 'react-emotion';
import { FormHeader } from '@ndla/forms';
import { Spinner } from '@ndla/editor';
import { fetchDraft, updateDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import { Row, HelpMessage, PreviewDraftLightbox } from '../../components';
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

function updateContentInDraft(draft, content) {
  return {
    ...draft,
    content: {
      ...draft.content,
      content,
    },
  };
}

const StyledErrorMessage = styled('p')`
  color: ${colors.support.red};
  text-align: center;
`;

const Container = styled('div')`
  margin: 0 auto;
  max-width: 1000px;
`;

const FetchErrorMessage = ({ draftId, language }) => (
  <Trans>
    {({ t }) => (
      <Container>
        <StyledErrorMessage>{t('editMarkup.fetchError')}</StyledErrorMessage>
        <Row justifyContent="center" alignItems="baseline">
          <Link
            to={`/subject-matter/learning-resource/${draftId}/edit/${language}`}>
            {t('editMarkup.back')}
          </Link>
        </Row>
      </Container>
    )}
  </Trans>
);

FetchErrorMessage.propTypes = {
  draftId: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

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
      draft: updateContentInDraft(prevState.draft, value),
    }));
  };

  render() {
    const { draftId, language } = this.props.match.params;
    const { status, draft } = this.state;

    if (status === 'fetch-error') {
      return <FetchErrorMessage draftId={draftId} language={language} />;
    }

    return (
      <Trans>
        {({ t }) => (
          <Container>
            <FormHeader
              title={t('editMarkup.title')}
              subTitle={t('editMarkup.subTitle')}>
              <HelpMessage>
                <p>{t('editMarkup.helpMessage.paragraph1')}</p>
                <p>{t('editMarkup.helpMessage.paragraph2')}</p>
              </HelpMessage>
            </FormHeader>
            <Suspense fallback={<Spinner />}>
              <MonacoEditor
                key={draft ? draft.id + draft.revision : 'draft'}
                value={draft ? draft.content.content : ''}
                onChange={this.handleChange}
              />
              {status === 'save-error' && (
                <StyledErrorMessage
                  css={css`
                    text-align: left;
                    margin: ${spacing.normal};
                  `}>
                  {t('editMarkup.saveError')}
                </StyledErrorMessage>
              )}
              <Row
                justifyContent="space-between"
                css={css`
                  margin: ${spacing.normal};
                `}>
                <PreviewDraftLightbox
                  label={t('subNavigation.learningResource')}
                  typeOfPreview="preview"
                  getArticle={() => {
                    const content = standardizeContent(
                      this.state.draft.content.content,
                    );
                    return {
                      ...updateContentInDraft(draft, content),
                      tags: [],
                      language,
                    };
                  }}
                />
                <Row justifyContent="end" alignItems="baseline">
                  <Link
                    to={`/subject-matter/learning-resource/${draftId}/edit/${language}`}>
                    {t('editMarkup.back')}
                  </Link>
                  <Button onClick={this.saveChanges}>{t('form.save')}</Button>
                </Row>
              </Row>
            </Suspense>
          </Container>
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
