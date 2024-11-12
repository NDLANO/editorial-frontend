/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { lazy, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing, colors } from "@ndla/core";
import { InformationLine } from "@ndla/icons/common";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
  Text,
  Button,
} from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { IArticle } from "@ndla/types-backend/draft-api";
import { Row } from "../../components";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import FieldHeader from "../../components/Field/FieldHeader";
import { FormActionsContainer } from "../../components/FormikForm";
import HeaderSupportedLanguages from "../../components/HeaderWithLanguage/HeaderSupportedLanguages";
import { OldSpinner } from "../../components/OldSpinner";
import { PreviewResourceDialog } from "../../components/PreviewDraft/PreviewResourceDialog";
import SaveButton from "../../components/SaveButton";
import { DRAFT_HTML_SCOPE } from "../../constants";
import { fetchDraft, updateDraft } from "../../modules/draft/draftApi";
import { blockContentToEditorValue, blockContentToHTML } from "../../util/articleContentConverter";
import handleError from "../../util/handleError";
import { NdlaErrorPayload } from "../../util/resolveJsonOrRejectWithError";
import { toEditMarkup } from "../../util/routeHelpers";
import { AlertDialogWrapper } from "../FormikForm";
import { useMessages } from "../Messages/MessagesProvider";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { getSessionStateFromLocalStorage } from "../Session/SessionProvider";

const MonacoEditor = lazy(() => import("../../components/MonacoEditor"));

// Serialize and deserialize content using slate helpers
// to ensure standarized markup.
// Also useful for detecting validation issues.
function standardizeContent(content: string): string {
  const trimmedContent = content
    .split(/>\r?\n/)
    .map((s) => s.trim())
    .join(">");
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
        <Link to={`/subject-matter/learning-resource/${draftId}/edit/${language}`}>{t("editMarkup.back")}</Link>
      </Row>
    </Container>
  );
};

interface LocationState {
  backUrl?: string;
}

type Status = "initial" | "edit" | "fetch-error" | "access-error" | "saving" | "saved";

const EditMarkupPage = () => {
  const { t } = useTranslation();
  const params = useParams<"draftId" | "language">();
  const draftId = Number(params.draftId) || undefined;
  const language = params.language!;
  const [status, setStatus] = useState<Status>("initial");
  const [draft, setDraft] = useState<IArticle | undefined>(undefined);
  const location = useLocation();
  const locationState = location.state as LocationState | undefined;
  const { createMessage, formatErrorMessage } = useMessages();

  useEffect(() => {
    const session = getSessionStateFromLocalStorage();
    if (!session.user.permissions?.includes(DRAFT_HTML_SCOPE)) {
      setStatus("access-error");
      return;
    }
    if (!draftId) {
      setStatus("fetch-error");
      return;
    }
    (async () => {
      try {
        const fetched = await fetchDraft(draftId, language);
        setDraft(fetched);
      } catch (e) {
        handleError(e);
        setStatus("fetch-error");
      }
    })();
  }, [draftId, language]);

  if (!draftId) {
    return <NotFoundPage />;
  }

  const saveChanges = async (editorContent: string) => {
    try {
      setStatus("saving");
      const content = standardizeContent(editorContent ?? "");
      const updatedDraft = await updateDraft(draftId, {
        content,
        revision: draft?.revision ?? 1,
        language,
        metaImage: undefined,
        responsibleId: undefined,
      });
      setDraft(updatedDraft);
      setStatus("saved");
    } catch (e) {
      const err = e as NdlaErrorPayload;
      createMessage(formatErrorMessage(err));
      handleError(e);
    }
  };

  const handleChange = (value: string) => {
    setStatus("edit");
    setDraft(updateContentInDraft(draft, value));
  };

  if (status === "access-error") {
    return <ErrorMessage draftId={draftId} language={language} messageId="forbiddenPage.description" />;
  }

  if (status === "fetch-error") {
    return <ErrorMessage draftId={draftId} language={language} messageId="editMarkup.fetchError" />;
  }
  const isDirty = status === "edit";
  const isSubmitting = status === "saving";
  return (
    <Container>
      <FieldHeader title={t("editMarkup.title")} subTitle={t("editMarkup.subTitle")}>
        <DialogRoot>
          <DialogTrigger asChild>
            <IconButton
              variant="tertiary"
              size="small"
              title={t("editMarkup.helpMessage.tooltip")}
              aria-label={t("editMarkup.helpMessage.tooltip")}
            >
              <InformationLine />
            </IconButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("editMarkup.helpMessage.tooltip")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              <Text>{t("editMarkup.helpMessage.paragraph1")}</Text>
              <Text>{t("editMarkup.helpMessage.paragraph2")}</Text>
            </DialogBody>
          </DialogContent>
        </DialogRoot>
      </FieldHeader>
      <LanguageWrapper>
        <HeaderSupportedLanguages
          supportedLanguages={draft?.supportedLanguages}
          language={language}
          editUrl={toEditMarkup}
          id={draftId}
          isSubmitting={isSubmitting}
          replace={true}
        />
      </LanguageWrapper>
      <Suspense fallback={<OldSpinner />}>
        <MonacoEditor
          key={draft && draft.content ? draft.id + draft.revision + "-" + draft.content.language : "draft"}
          value={draft?.content?.content ?? ""}
          size="large"
          onChange={handleChange}
          onSave={saveChanges}
        />
        <StyledRow>
          {!!draft && (
            <PreviewResourceDialog
              type="markup"
              language={language}
              article={draft}
              activateButton={<Button variant="link">{t("form.preview.button")}</Button>}
            />
          )}
          <FormActionsContainer>
            <SafeLinkButton
              variant="secondary"
              to={locationState?.backUrl || `/subject-matter/learning-resource/${draftId}/edit/${language}`}
            >
              {t("editMarkup.back")}
            </SafeLinkButton>
            <SaveButton
              loading={status === "saving"}
              formIsDirty={status === "edit"}
              showSaved={status === "saved"}
              onClick={() => saveChanges(draft?.content?.content ?? "")}
            />
          </FormActionsContainer>
        </StyledRow>
      </Suspense>
      <AlertDialogWrapper
        isSubmitting={isSubmitting}
        formIsDirty={isDirty}
        severity="danger"
        text={t("alertModal.notSaved")}
      />
    </Container>
  );
};

export default EditMarkupPage;
