/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { lazy, Suspense, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { spacing, colors } from '@ndla/core';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { FieldHeader } from '@ndla/forms';
import { Spinner } from '@ndla/editor';
import { fetchDraft, updateDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import { Row, PreviewDraftLightbox } from '../../components';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../../util/articleContentConverter';
import { DRAFT_HTML_SCOPE } from '../../constants';
import { getSessionStateFromLocalStorage } from '../Session/SessionProvider';
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

const MonacoEditor = lazy(() => import('../../components/MonacoEditor'));

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

const ErrorMessage = ({ draftId, language, messageId }: ErrorMessageProps) => {
  const { t } = useTranslation();
  return (
    <Container>
      <StyledErrorMessage>{t(messageId)}</StyledErrorMessage>
      <Row justifyContent="center" alignItems="baseline">
        <Link to={`/subject-matter/learning-resource/${draftId}/edit/${language}`}>
          {t('editMarkup.back')}
        </Link>
      </Row>
    </Container>
  );
};

ErrorMessage.propTypes = {
  messageId: PropTypes.string.isRequired,
  draftId: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

type Status =
  | 'initial'
  | 'edit'
  | 'fetch-error'
  | 'save-error'
  | 'access-error'
  | 'saving'
  | 'saved';

const EditMarkupPage = () => {
  const { t } = useTranslation();
  const params = useParams<'draftId' | 'language'>();
  const draftId = params.draftId!;
  const language = params.language!;
  const [status, setStatus] = useState<Status>('initial');
  const [draft, setDraft] = useState<DraftApiType | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    const session = getSessionStateFromLocalStorage();
    if (!session.user.scope?.includes(DRAFT_HTML_SCOPE)) {
      setStatus('access-error');
      return;
    }
    (async () => {
      try {
        const fetched = await fetchDraft(draftId, language);
        setDraft(fetched);
      } catch (e) {
        handleError(e);
        setStatus('fetch-error');
      }
    })();
  }, [draftId, language]);

  const saveChanges = async (editorContent: string) => {
    try {
      setStatus('saving');
      const content = standardizeContent(editorContent ?? '');
      const updatedDraft = await updateDraft({
        id: parseInt(draftId, 10),
        content,
        revision: draft?.revision ?? -1,
        language,
        supportedLanguages: draft?.supportedLanguages ?? [],
      });
      setDraft(updatedDraft);
      setStatus('saved');
    } catch (e) {
      handleError(e);
      setStatus('save-error');
    }
  };

  const handleChange = (value: string) => {
    setStatus('edit');
    setDraft(updateContentInDraft(draft, value));
  };

  if (status === 'access-error') {
    return (
      <ErrorMessage draftId={draftId} language={language} messageId="forbiddenPage.description" />
    );
  }

  if (status === 'fetch-error') {
    return <ErrorMessage draftId={draftId} language={language} messageId="editMarkup.fetchError" />;
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
          id={parseInt(draftId)}
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
          onChange={handleChange}
          onSave={saveChanges}
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
            label={t('form.previewProductionArticle.published')}
            typeOfPreview="preview"
            getArticle={() => {
              const content = standardizeContent(draft?.content?.content ?? '');
              const update = updateContentInDraft(draft, content)!;
              return {
                ...update,
                tags: { tags: [], language },
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
              onClick={() => saveChanges(draft?.content?.content ?? '')}
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
};

export default EditMarkupPage;
