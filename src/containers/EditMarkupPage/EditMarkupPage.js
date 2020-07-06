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
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { FieldHeader } from '@ndla/forms';
import { Spinner } from '@ndla/editor';
import { fetchDraft, updateDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import { Row, HelpMessage, PreviewDraftLightbox } from '../../components';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../util/articleContentConverter';
import { DRAFT_HTML_SCOPE } from '../../constants';
import { getSessionStateFromLocalStorage } from '../../modules/session/session';
import HeaderSupportedLanguages from '../../components/HeaderWithLanguage/HeaderSupportedLanguages';
import { toEditMarkup } from '../../util/routeHelpers';
import { FormikAlertModalWrapper } from '../FormikForm';

const MonacoEditor = React.lazy(() => import('../../components/MonacoEditor'));

// Serialize and deserialize content using slate helpers
// to ensure standarized markup.
// Also useful for detecting validation issues.
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

const LanguageWrapper = styled.div`
  display: flex;
`;

const ErrorMessage = ({ draftId, language, messageId }) => (
  <Trans>
    {({ t }) => (
      <Container>
        <StyledErrorMessage>{t(messageId)}</StyledErrorMessage>
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

ErrorMessage.propTypes = {
  messageId: PropTypes.string.isRequired,
  draftId: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

export class EditMarkupPage extends Component {
  state = {
    // initial | edit | fetch-error | save-error | access-error | saving
    status: 'initial',
    draft: undefined,
  };

  async componentDidMount() {
    const session = getSessionStateFromLocalStorage();

    if (!session.user.scope.includes(DRAFT_HTML_SCOPE)) {
      this.setState({ status: 'access-error' });
      return;
    }

    try {
      const { draftId, language } = this.props.match.params;
      const draft = await fetchDraft(draftId, language);
      this.setState({ draft });
    } catch (e) {
      handleError(e);
      this.setState({ status: 'fetch-error' });
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.match.params.language !== this.props.match.params.language) {
      const session = getSessionStateFromLocalStorage();

      if (!session.user.scope.includes(DRAFT_HTML_SCOPE)) {
        this.setState({ status: 'access-error' });
        return;
      }

      try {
        const { draftId, language } = this.props.match.params;
        const draft = await fetchDraft(draftId, language);
        this.setState({ draft });
      } catch (e) {
        handleError(e);
        this.setState({ status: 'fetch-error' });
      }
    }
  }

  saveChanges = async () => {
    try {
      const { draftId, language } = this.props.match.params;
      this.setState({ status: 'saving' });
      const content = standardizeContent(this.state.draft.content.content);
      await updateDraft({
        id: parseInt(draftId, 10),
        content,
        revision: this.state.draft.revision,
        language,
      });
    } catch (e) {
      handleError(e);
      this.setState({ status: 'save-error' });
    }
  };

  handleChange = value => {
    this.setState(prevState => ({
      draft: updateContentInDraft(prevState.draft, value),
      status: 'edit',
    }));
  };

  render() {
    const { draftId, language } = this.props.match.params;
    const { status, draft } = this.state;
    const { state } = this.props.history.location;
    if (status === 'access-error') {
      return (
        <ErrorMessage
          draftId={draftId}
          language={language}
          messageId="forbiddenPage.description"
        />
      );
    }

    if (status === 'fetch-error') {
      return (
        <ErrorMessage
          draftId={draftId}
          language={language}
          messageId="editMarkup.fetchError"
        />
      );
    }
    const isDirty = status === 'edit';
    const isSubmitting = status === 'saving';
    return (
      <Trans>
        {({ t }) => (
          <Container>
            <FieldHeader
              title={t('editMarkup.title')}
              subTitle={t('editMarkup.subTitle')}>
              <HelpMessage>
                <p>{t('editMarkup.helpMessage.paragraph1')}</p>
                <p>{t('editMarkup.helpMessage.paragraph2')}</p>
              </HelpMessage>
            </FieldHeader>
            <LanguageWrapper>
              <HeaderSupportedLanguages
                supportedLanguages={draft?.supportedLanguages}
                language={language}
                editUrl={lang => toEditMarkup(draftId, lang)}
                id={draftId}
                isSubmitting={isSubmitting}
                replace={true}
              />
            </LanguageWrapper>
            <Suspense fallback={<Spinner />}>
              <MonacoEditor
                key={
                  draft
                    ? draft.id + draft.revision + '-' + draft.content.language
                    : 'draft'
                }
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
                  label={t('form.previewProductionArticle.article')}
                  typeOfPreview="preview"
                  getArticle={() => {
                    const content = standardizeContent(draft.content.content);
                    return {
                      ...updateContentInDraft(draft, content),
                      tags: [],
                      language,
                    };
                  }}
                />
                <Row justifyContent="end" alignItems="baseline">
                  <Link
                    to={
                      state
                        ? state.backUrl
                        : `/subject-matter/learning-resource/${draftId}/edit/${language}`
                    }>
                    {t('editMarkup.back')}
                  </Link>
                  <Button
                    disabled={status === 'initial' || status === 'saving'}
                    onClick={this.saveChanges}>
                    {t('form.save')}
                  </Button>
                </Row>
              </Row>
            </Suspense>
            <FormikAlertModalWrapper
              isSubmitting={isSubmitting}
              formIsDirty={isDirty}
              severity="danger"
              text={t('alertModal.notSaved')}
            />
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({
      state: PropTypes.shape({
        backUrl: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default EditMarkupPage;
