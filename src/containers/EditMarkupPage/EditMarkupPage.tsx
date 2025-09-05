/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { lazy, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router";
import { InformationLine } from "@ndla/icons";
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
  Spinner,
  PageContainer,
  Heading,
} from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { FormActionsContainer } from "../../components/FormikForm";
import HeaderSupportedLanguages from "../../components/HeaderWithLanguage/HeaderSupportedLanguages";
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
import PrivateRoute from "../PrivateRoute/PrivateRoute";
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

function updateContentInDraft(draft: IArticleDTO | undefined, content: string): IArticleDTO | undefined {
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

const LanguageWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "4xsmall",
  },
});

const StyledRow = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const HeaderWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "xsmall",
  },
});

const StyledPageContainerError = styled(PageContainer, {
  base: {
    textAlign: "center",
    gap: "xsmall",
  },
});

interface ErrorMessageProps {
  draftId: number;
  language: string;
  messageId: string;
}

const ErrorMessage = ({ draftId, language, messageId }: ErrorMessageProps) => {
  const { t } = useTranslation();
  return (
    <StyledPageContainerError variant="page" padding="small">
      <Text color="text.error">{t(messageId)}</Text>
      <Link to={`/subject-matter/learning-resource/${draftId}/edit/${language}`}>{t("editMarkup.back")}</Link>
    </StyledPageContainerError>
  );
};

interface LocationState {
  backUrl?: string;
}

type Status = "initial" | "edit" | "fetch-error" | "access-error" | "saving" | "saved";

export const Component = () => <PrivateRoute component={<EditMarkupPage />} />;

const EditMarkupPage = () => {
  const { t } = useTranslation();
  const params = useParams<"draftId" | "language">();
  const draftId = Number(params.draftId) || undefined;
  const language = params.language!;
  const [status, setStatus] = useState<Status>("initial");
  const [draft, setDraft] = useState<IArticleDTO | undefined>(undefined);
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
    <StyledPageContainer variant="page" padding="small">
      <HeaderWrapper>
        <hgroup>
          <Heading textStyle="title.medium">{t("editMarkup.title")}</Heading>
          <Text color="text.subtle">{t("editMarkup.subTitle")}</Text>
        </hgroup>
        <DialogRoot>
          <DialogTrigger asChild>
            <IconButton
              variant="secondary"
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
      </HeaderWrapper>
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
      <Suspense fallback={<Spinner />}>
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
        text={t("alertDialog.notSaved")}
      />
    </StyledPageContainer>
  );
};
