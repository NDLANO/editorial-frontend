/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Spinner,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { cva } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { IEditorNoteDTO } from "@ndla/types-backend/draft-api";
import { constants, ContentTypeBadge } from "@ndla/ui";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import NotesVersionHistory from "../../../components/VersionHistory/VersionHistory";
import { Auth0UserData } from "../../../interfaces";
import { fetchAuth0Users } from "../../../modules/auth0/auth0Api";
import { fetchArticleRevisionHistory } from "../../../modules/draft/draftApi";
import { ResourceWithNodeConnectionAndMeta } from "../../../modules/nodes/nodeApiTypes";
import formatDate from "../../../util/formatDate";
import { routes } from "../../../util/routeHelpers";
import { getIdFromUrn } from "../../../util/taxonomyHelpers";

const { contentTypes } = constants;

interface Props {
  resource: ResourceWithNodeConnectionAndMeta;
  contentType: string;
}

const LinkWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
    alignItems: "flex-start",
  },
});

const linkRecipe = cva({
  base: {
    color: "text.link",
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
    _visited: {
      color: "text.linkVisited",
    },
  },
  variants: {
    invisible: {
      true: {
        color: "text.subtle",
        fontStyle: "italic",
      },
    },
  },
});

const StyledButton = styled(Button, { base: { whiteSpace: "nowrap" } });

const VersionHistory = ({ resource, contentType }: Props) => {
  const { t } = useTranslation();
  if (!resource.contentMeta?.status) {
    return null;
  }
  return (
    <DialogRoot position="top">
      <DialogTrigger asChild>
        <StyledButton variant="secondary" size="small" disabled={contentType === contentTypes.LEARNING_PATH}>
          {t(`form.status.${resource.contentMeta.status.current.toLowerCase()}`)}
        </StyledButton>
      </DialogTrigger>
      <Portal>
        <DialogContent>
          <VersionHistoryContent contentType={contentType} resource={resource} />
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

interface DialogContentProps {
  contentType: string;
  resource: ResourceWithNodeConnectionAndMeta;
}

interface VersionHistoryNotes {
  id: number;
  note: string;
  author: string;
  date: string;
  status: string;
}

const VersionHistoryContent = ({ contentType, resource }: DialogContentProps) => {
  const { t, i18n } = useTranslation();
  const [notes, setNotes] = useState<VersionHistoryNotes[] | undefined>(undefined);
  const numericId = parseInt(resource.contentUri?.split(":").pop() ?? "");

  useEffect(() => {
    const cleanupNotes = (notes: IEditorNoteDTO[], users: Auth0UserData[]) =>
      notes.map((note, index) => ({
        id: index,
        note: note.note,
        author: users.find((user) => user.app_metadata.ndla_id === note.user)?.name || "",
        date: formatDate(note.timestamp),
        status: t(`form.status.${note.status.current.toLowerCase()}`),
      }));

    const fetchHistory = async (id: number) => {
      const articleRevisionHistory = await fetchArticleRevisionHistory(id);
      const notes: IEditorNoteDTO[] = articleRevisionHistory?.revisions[0]?.notes;
      if (notes?.length) {
        const userIds = notes.map((note) => note.user).filter((user) => user !== "System");
        const uniqueUserIds = Array.from(new Set(userIds)).join(",");
        const users = await fetchAuth0Users(uniqueUserIds);
        setNotes(cleanupNotes(notes, users));
      } else {
        setNotes([]);
      }
    };
    const id = getIdFromUrn(resource.contentUri);
    if (id) {
      fetchHistory(id);
    }
  }, [resource.contentUri, t]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("form.workflowSection")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <LinkWrapper>
          <ContentTypeBadge contentType={contentType === "topic-article" ? "topic" : contentType} />
          {numericId ? (
            <SafeLink
              to={
                contentType === "learning-path"
                  ? routes.learningpath.edit(numericId, i18n.language)
                  : routes.editArticle(numericId, contentType)
              }
              target="_blank"
              rel="noopener noreferrer"
              css={linkRecipe.raw({ invisible: !resource.metadata.visible })}
            >
              {resource.name}
            </SafeLink>
          ) : (
            <Text textStyle="body.link" css={linkRecipe.raw({ invisible: !resource.metadata.visible })}>
              {resource.name}
            </Text>
          )}
        </LinkWrapper>
        {notes?.length ? <NotesVersionHistory notes={notes} /> : notes ? t("form.notes.history.empty") : <Spinner />}
      </DialogBody>
    </>
  );
};

export default VersionHistory;
