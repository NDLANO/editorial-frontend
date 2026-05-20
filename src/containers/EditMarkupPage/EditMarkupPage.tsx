/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
import { ArticleDTO } from "@ndla/types-backend/draft-api";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { FormActionsContainer } from "../../components/FormikForm";
import HeaderSupportedLanguages from "../../components/HeaderWithLanguage/HeaderSupportedLanguages";
import { PageSpinner } from "../../components/PageSpinner";
import { PreviewResourceDialog } from "../../components/PreviewDraft/PreviewResourceDialog";
import SaveButton from "../../components/SaveButton";
import { DRAFT_HTML_SCOPE } from "../../constants";
import { useUpdateDraftMutation } from "../../modules/draft/draftMutations";
import { draftQueryOptions } from "../../modules/draft/draftQueries";
import { blockContentToEditorValue, blockContentToHTML } from "../../util/articleContentConverter";
import handleError from "../../util/handleError";
import { NdlaErrorPayload } from "../../util/resolveJsonOrRejectWithError";
import { toEditMarkup } from "../../util/routeHelpers";
import { AlertDialogWrapper } from "../FormikForm";
import { useMessages } from "../Messages/MessagesProvider";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { useSession } from "../Session/SessionProvider";

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

export const Component = () => <PrivateRoute component={<EditMarkupPage />} />;

const EditMarkupPage = () => {
  const params = useParams<"draftId" | "language">();
  const draftId = Number(params.draftId) || undefined;
  const language = params.language!;
  const { userPermissions } = useSession();

  const draftQuery = useQuery({
    ...draftQueryOptions({ id: draftId!, language }),
    enabled: !!draftId && userPermissions?.includes(DRAFT_HTML_SCOPE),
  });

  if (!draftId) {
    return <NotFoundPage />;
  }

  if (!userPermissions?.includes(DRAFT_HTML_SCOPE)) {
    return <ErrorMessage draftId={draftId} language={language} messageId="forbiddenPage.description" />;
  }

  if (draftQuery.isFetching) {
    return <PageSpinner />;
  }

  if (draftQuery.isError || !draftQuery.data) {
    return <ErrorMessage draftId={draftId} language={language} messageId="editMarkup.fetchError" />;
  }

  return (
    <EditMarkup
      draft={draftQuery.data}
      language={language}
      key={`${draftQuery.data.id}-${draftQuery.data.revision}-${draftQuery.data.content?.language}`}
    />
  );
};

interface EditMarkupProps {
  draft: ArticleDTO;
  language: string;
}

const EditMarkup = ({ draft, language }: EditMarkupProps) => {
  const { t } = useTranslation();
  const [content, setContent] = useState<string>(draft.content?.content ?? "");
  const draftMutation = useUpdateDraftMutation();
  const { createMessage, formatErrorMessage } = useMessages();
  const location = useLocation();
  const locationState = location.state as LocationState | undefined;

  const saveChanges = async (editorContent: string) => {
    const content = standardizeContent(editorContent ?? "");
    draftMutation.mutate(
      {
        id: draft.id,
        body: {
          content,
          revision: draft?.revision ?? 1,
          language,
          metaImage: undefined,
          responsibleId: undefined,
        },
      },
      {
        onSuccess: (data, _, __, context) => {
          const options = draftQueryOptions({ id: draft.id, language });
          context.client.setQueryData(options.queryKey, data);
          context.client.invalidateQueries({ queryKey: options.queryKey, refetchType: "inactive" });
        },
        onError: (e: any) => {
          const err = e as NdlaErrorPayload;
          createMessage(formatErrorMessage(err));
          handleError(e);
        },
      },
    );
  };

  const dirty = draft.content?.content !== content;

  return (
    <StyledPageContainer variant="page" padding="small">
      <title>{`${draft?.title?.title} - ${t("htmlTitles.htmlEditorPage")}`}</title>
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
          id={draft.id}
          isSubmitting={draftMutation.isPending}
          replace={true}
        />
      </LanguageWrapper>
      <Suspense fallback={<Spinner />}>
        <MonacoEditor
          value={draft?.content?.content ?? ""}
          size="large"
          onChange={(value) => setContent(value)}
          onSave={saveChanges}
        />
      </Suspense>
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
            to={locationState?.backUrl || `/subject-matter/learning-resource/${draft.id}/edit/${language}`}
          >
            {t("editMarkup.back")}
          </SafeLinkButton>
          <SaveButton
            loading={draftMutation.isPending}
            formIsDirty={dirty}
            showSaved={!!draftMutation.isSuccess && !dirty}
            onClick={() => saveChanges(content)}
          />
        </FormActionsContainer>
      </StyledRow>
      <AlertDialogWrapper
        isSubmitting={draftMutation.isPending}
        formIsDirty={dirty}
        severity="danger"
        text={t("alertDialog.notSaved")}
      />
    </StyledPageContainer>
  );
};
