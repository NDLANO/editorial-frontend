/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { lazy, Suspense, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ButtonV2 } from '@ndla/button';
import { spacing, colors } from '@ndla/core';
import { IArticle } from '@ndla/types-backend/draft-api';
import styled from '@emotion/styled';
import { FieldHeader } from '@ndla/forms';
import { Spinner } from '@ndla/icons';
import { fetchDraft, updateDraft } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import { Row } from '../../components';
import { blockContentToEditorValue, blockContentToHTML } from '../../util/articleContentConverter';
import { DRAFT_HTML_SCOPE, PUBLISHED } from '../../constants';
import { getSessionStateFromLocalStorage, useSession } from '../Session/SessionProvider';
import HeaderSupportedLanguages from '../../components/HeaderWithLanguage/HeaderSupportedLanguages';
import { toEditMarkup } from '../../util/routeHelpers';
import { AlertModalWrapper } from '../FormikForm';
import SaveButton from '../../components/SaveButton';
import HelpMessage from '../../components/HelpMessage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useMessages } from '../Messages/MessagesProvider';
import { NdlaErrorPayload } from '../../util/resolveJsonOrRejectWithError';
import PreviewDraftLightboxV2 from '../../components/PreviewDraft/PreviewDraftLightboxV2';

declare global {
  interface Window {
    MonacoEnvironment: {
      getWorkerUrl: (moduleId: string, label: string) => string;
      globalAPI: boolean;
    };
  }
}

window.MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    if (label === 'html') {
      return process.env.NODE_ENV !== 'production'
        ? '/static/js/html.worker.js'
        : // @ts-ignore
          window.assets['html.worker.js'] ?? '';
    }
    return process.env.NODE_ENV !== 'production'
      ? '/static/js/editor.worker.js'
      : // @ts-ignore
        window.assets['editor.worker.js'] ?? '';
  },
  globalAPI: true,
};

const MonacoEditor = lazy(() => import('../../components/MonacoEditor'));

// Serialize and deserialize content using slate helpers
// to ensure standarized markup.
// Also useful for detecting validation issues.
function standardizeContent(content: string): string {
  const trimmedContent = content
    .split(/>\r?\n/)
    .map((s) => s.trim())
    .join('>');
  const converted = blockContentToEditorValue(trimmedContent);
  return blockContentToHTML(converted);
}

function updateContentInDraft(draft: IArticle | undefined, content: string): IArticle | undefined {
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

const StyledErrorMessage = styled.p`
  color: ${colors.support.red};
  text-align: center;
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 1000px;
  width: 100%;
`;

const LanguageWrapper = styled.div`
  display: flex;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${spacing.small};
`;

interface ErrorMessageProps {
  draftId: number;
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

interface LocationState {
  backUrl?: string;
}

type Status = 'initial' | 'edit' | 'fetch-error' | 'access-error' | 'saving' | 'saved';

const EditMarkupPage = () => {
  const { t } = useTranslation();
  const params = useParams<'draftId' | 'language'>();
  const draftId = Number(params.draftId) || undefined;
  const language = params.language!;
  const [status, setStatus] = useState<Status>('initial');
  const [draft, setDraft] = useState<IArticle | undefined>(undefined);
  const location = useLocation();
  const locationState = location.state as LocationState | undefined;
  const { createMessage, formatErrorMessage } = useMessages();
  const { ndlaId } = useSession();

  useEffect(() => {
    const session = getSessionStateFromLocalStorage();
    if (!session.user.permissions?.includes(DRAFT_HTML_SCOPE)) {
      setStatus('access-error');
      return;
    }
    if (!draftId) {
      setStatus('fetch-error');
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

  if (!draftId) {
    return <NotFoundPage />;
  }

  const saveChanges = async (editorContent: string) => {
    try {
      setStatus('saving');
      const content = standardizeContent(editorContent ?? '');
      const updatedDraft = await updateDraft(draftId, {
        content,
        revision: draft?.revision ?? -1,
        language,
        ...(draft?.status.current === PUBLISHED ? { responsibleId: ndlaId } : {}),
      });
      setDraft(updatedDraft);
      setStatus('saved');
    } catch (e) {
      setStatus('initial');
      const err = e as NdlaErrorPayload;
      createMessage(formatErrorMessage(err));
      handleError(e);
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
          onChange={handleChange}
          onSave={saveChanges}
        />
        <StyledRow>
          {!!draft && (
            <PreviewDraftLightboxV2
              type="markup"
              language={language}
              article={draft}
              activateButton={<ButtonV2 variant="link">{t('form.preview.button')}</ButtonV2>}
            />
          )}
          <Row justifyContent="end" alignItems="baseline">
            <Link
              to={
                locationState?.backUrl ||
                `/subject-matter/learning-resource/${draftId}/edit/${language}`
              }
            >
              {t('editMarkup.back')}
            </Link>
            <SaveButton
              isSaving={status === 'saving'}
              formIsDirty={status === 'edit'}
              showSaved={status === 'saved'}
              onClick={() => saveChanges(draft?.content?.content ?? '')}
            />
          </Row>
        </StyledRow>
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
