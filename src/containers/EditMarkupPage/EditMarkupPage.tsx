/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import { injectT, tType } from '@ndla/i18n';
import { Link } from 'react-router-dom';
import { spacing, colors } from '@ndla/core';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { FieldHeader } from '@ndla/forms';
import { Spinner } from '@ndla/editor';
import { RouteComponentProps } from 'react-router';
import { fetchDraft, updateDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import { Row, PreviewDraftLightbox } from '../../components';

import { HistoryShape } from '../../shapes';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../util/articleContentConverter';
import { DRAFT_HTML_SCOPE } from '../../constants';
import { getSessionStateFromLocalStorage } from '../../modules/session/session';
import HeaderSupportedLanguages from '../../components/HeaderWithLanguage/HeaderSupportedLanguages';
import { toEditMarkup } from '../../util/routeHelpers';
import { AlertModalWrapper, formClasses } from '../FormikForm';
import SaveButton from '../../components/SaveButton';
import { DraftApiType } from '../../modules/draft/draftApiInterfaces';
import HelpMessage from '../../components/HelpMessage';

declare global {
  interface Window {
    MonacoEnvironment: {
      getWorkerUrl: (moduleId: string, label: string) => string;
      globalAPI: boolean;
    };
  }
}

window.MonacoEnvironment = {
  getWorkerUrl: function(moduleId: string, label: string) {
    if (label === 'html') {
      return '/static/js/html.worker.js';
    }
    return '/static/js/editor.worker.js';
  },
  globalAPI: true,
};

const MonacoEditor = React.lazy(() => import('../../components/MonacoEditor'));

// Serialize and deserialize content using slate helpers
// to ensure standarized markup.
// Also useful for detecting validation issues.
function standardizeContent(content: string): string {
  const trimmedContent = content
    .split('>\n')
    .map(s => s.trim())
    .join('>');
  const converted = learningResourceContentToEditorValue(trimmedContent);
  return learningResourceContentToHTML(converted);
}

function updateContentInDraft(
  draft: DraftApiType | undefined,
  content: string,
): DraftApiType | undefined {
  if (draft === undefined || draft.content === undefined) {
    return undefined;
  }

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

interface ErrorMessageProps {
  draftId: string;
  language: string;
  messageId: string;
}

const ErrorMessage = injectT(({ draftId, language, messageId, t }: ErrorMessageProps & tType) => (
  <Container>
    <StyledErrorMessage>{t(messageId)}</StyledErrorMessage>
    <Row justifyContent="center" alignItems="baseline">
      <Link to={`/subject-matter/learning-resource/${draftId}/edit/${language}`}>
        {t('editMarkup.back')}
      </Link>
    </Row>
  </Container>
));

ErrorMessage.propTypes = {
  messageId: PropTypes.string.isRequired,
  draftId: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

interface MatchParams {
  draftId: string;
  language: string;
}

interface MarkupLocationState {
  backUrl?: string;
}

interface Props extends RouteComponentProps<MatchParams, {}, MarkupLocationState> {}

type Status =
  | 'initial'
  | 'edit'
  | 'fetch-error'
  | 'save-error'
  | 'access-error'
  | 'saving'
  | 'saved';

interface State {
  status: Status;
  draft: DraftApiType | undefined;
}

class EditMarkupPage extends Component<Props & tType, State> {
  constructor(props: Props & tType) {
    super(props);
    this.state = {
      status: 'initial',
      draft: undefined,
    };
    this.saveChanges = this.saveChanges.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    const session = getSessionStateFromLocalStorage();

    if (!session.user?.scope?.includes(DRAFT_HTML_SCOPE)) {
      this.setState({ status: 'access-error' });
      return;
    }

    try {
      const { draftId, language } = this.props.match.params;
      const draft = await fetchDraft(Number(draftId), language);
      this.setState({ draft });
    } catch (e) {
      handleError(e);
      this.setState({ status: 'fetch-error' });
    }
  }

  async componentDidUpdate(prevProps: Props) {
    if (prevProps.match.params.language !== this.props.match.params.language) {
      const session = getSessionStateFromLocalStorage();

      if (!session.user?.scope?.includes(DRAFT_HTML_SCOPE)) {
        this.setState({ status: 'access-error' });
        return;
      }

      try {
        const { draftId, language } = this.props.match.params;
        const draft = await fetchDraft(Number(draftId), language);
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
      const stateContent = this.state.draft?.content?.content;
      const content = standardizeContent(stateContent ?? '');
      const draft = await updateDraft({
        id: parseInt(draftId, 10),
        content,
        revision: this.state.draft?.revision ?? -1,
        language,
      });
      this.setState({ status: 'saved', draft });
    } catch (e) {
      handleError(e);
      this.setState({ status: 'save-error' });
    }
  };

  handleChange = (value: string) => {
    this.setState(prevState => ({
      draft: updateContentInDraft(prevState.draft, value),
      status: 'edit',
    }));
  };

  render() {
    const { draftId, language } = this.props.match.params;
    const { t } = this.props;
    const { status, draft } = this.state;
    const { location } = this.props.history;
    if (status === 'access-error') {
      return (
        <ErrorMessage draftId={draftId} language={language} messageId="forbiddenPage.description" />
      );
    }

    if (status === 'fetch-error') {
      return (
        <ErrorMessage draftId={draftId} language={language} messageId="editMarkup.fetchError" />
      );
    }
    const isDirty = status === 'edit';
    const isSubmitting = status === 'saving';
    return (
      <Container>
        <FieldHeader title={t('editMarkup.title')} subTitle={t('editMarkup.subTitle')}>
          <HelpMessage>
            <p>{t('editMarkup.helpMessage.paragraph1')}</p>
            <p>{t('editMarkup.helpMessage.paragraph2')}</p>
          </HelpMessage>
        </FieldHeader>
        <LanguageWrapper>
          <HeaderSupportedLanguages
            supportedLanguages={draft?.supportedLanguages}
            language={language}
            editUrl={(lang: string) => toEditMarkup(draftId, lang)}
            id={draftId}
            isSubmitting={isSubmitting}
            replace={true}
          />
        </LanguageWrapper>
        <Suspense fallback={<Spinner />}>
          <MonacoEditor
            key={
              draft && draft.content
                ? draft.id + draft.revision + '-' + draft.content.language
                : 'draft'
            }
            value={draft?.content?.content ?? ''}
            onChange={this.handleChange}
            onSave={this.saveChanges}
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
                const content = standardizeContent(draft?.content?.content ?? '');
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
                  location.state?.backUrl ||
                  `/subject-matter/learning-resource/${draftId}/edit/${language}`
                }>
                {t('editMarkup.back')}
              </Link>
              <SaveButton
                {...formClasses}
                isSaving={status === 'saving'}
                formIsDirty={status === 'edit'}
                showSaved={status === 'saved'}
                onClick={this.saveChanges}
              />
            </Row>
          </Row>
        </Suspense>
        <AlertModalWrapper
          isSubmitting={isSubmitting}
          formIsDirty={isDirty}
          severity="danger"
          text={t('alertModal.notSaved')}
        />
      </Container>
    );
  }

  static propTypes = {
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      params: PropTypes.shape({
        draftId: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired,
      }).isRequired,
      isExact: PropTypes.bool.isRequired,
      path: PropTypes.string.isRequired,
    }).isRequired,
    history: HistoryShape,
  };
}

export default injectT(EditMarkupPage);
