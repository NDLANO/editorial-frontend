/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing, colors } from "@ndla/core";
import { ModalBody, ModalHeader, ModalTitle, Modal, ModalTrigger, ModalContent, ModalCloseButton } from "@ndla/modal";
import { IEditorNote } from "@ndla/types-backend/draft-api";
import { constants, ContentTypeBadge } from "@ndla/ui";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import { OldSpinner } from "../../../components/OldSpinner";
import ResourceItemLink from "../../../components/Taxonomy/ResourceItemLink";
import NotesVersionHistory from "../../../components/VersionHistory/VersionHistory";
import { Auth0UserData } from "../../../interfaces";
import { fetchAuth0Users } from "../../../modules/auth0/auth0Api";
import { fetchDraftHistory } from "../../../modules/draft/draftApi";
import formatDate from "../../../util/formatDate";
import { getIdFromUrn } from "../../../util/taxonomyHelpers";

const { contentTypes } = constants;

interface Props {
  resource: ResourceWithNodeConnectionAndMeta;
  contentType: string;
}

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const shouldForwardProp = (p: string) => p !== "isPublished";

interface StyledButtonProps {
  isPublished?: boolean;
}

const StyledButton = styled(ButtonV2, { shouldForwardProp })<StyledButtonProps>`
  border: none;
  flex: 2;

  background-color: ${(props) => (props.isPublished ? colors.subjectMaterial.light : colors.learningPath.light)};
  &:hover {
    background-color: ${(props) => (props.isPublished ? colors.subjectMaterial.dark : colors.learningPath.dark)};
  }
`;

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0;
`;

const LinkWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const VersionHistory = ({ resource, contentType }: Props) => {
  const { t } = useTranslation();
  if (!resource.contentMeta?.status) {
    return null;
  }
  return (
    <Modal>
      <ModalTrigger>
        <StyledButton
          colorTheme="light"
          size="xsmall"
          disabled={contentType === contentTypes.LEARNING_PATH}
          isPublished={resource.contentMeta.status.current.toLowerCase() === "published"}
        >
          {t(`form.status.${resource.contentMeta.status.current.toLowerCase()}`)}
        </StyledButton>
      </ModalTrigger>
      <ModalContent position="top">
        <VersionHistoryContent contentType={contentType} resource={resource} />
      </ModalContent>
    </Modal>
  );
};

interface ModalContentProps {
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

const VersionHistoryContent = ({ contentType, resource }: ModalContentProps) => {
  const { t, i18n } = useTranslation();
  const [notes, setNotes] = useState<VersionHistoryNotes[] | undefined>(undefined);

  useEffect(() => {
    const cleanupNotes = (notes: IEditorNote[], users: Auth0UserData[]) =>
      notes.map((note, index) => ({
        id: index,
        note: note.note,
        author: users.find((user) => user.app_metadata.ndla_id === note.user)?.name || "",
        date: formatDate(note.timestamp),
        status: t(`form.status.${note.status.current.toLowerCase()}`),
      }));

    const fetchHistory = async (id: number) => {
      const versions = await fetchDraftHistory(id);
      const notes: IEditorNote[] = versions?.[0]?.notes;
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
      <StyledModalHeader>
        <ModalTitle>{t("form.workflowSection")}</ModalTitle>
        <ModalCloseButton />
      </StyledModalHeader>
      <StyledModalBody>
        <LinkWrapper>
          <ContentTypeBadge background type={contentType === "topic-article" ? "topic" : contentType} />
          <ResourceItemLink
            contentType={contentType}
            contentUri={resource.contentUri}
            locale={i18n.language}
            name={resource.name}
            isVisible={resource.metadata?.visible}
          />
        </LinkWrapper>
        {notes?.length ? <NotesVersionHistory notes={notes} /> : notes ? t("form.notes.history.empty") : <OldSpinner />}
      </StyledModalBody>
    </>
  );
};

export default VersionHistory;
