/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@ndla/primitives";
import { EditorNoteDTO as EditorNoteConcept } from "@ndla/types-backend/concept-api";
import { EditorNoteDTO } from "@ndla/types-backend/image-api";
import VersionHistory from "../../components/VersionHistory/VersionHistory";
import { fetchAuth0UsersFromUserIds, SimpleUserType } from "../../modules/auth0/auth0Api";
import formatDate from "../../util/formatDate";

const getUser = (userId: string, allUsers: SimpleUserType[]): string => {
  const user = allUsers.find((user) => user.id === userId);
  return user?.name ?? "";
};

interface Props {
  editorNotes: EditorNoteDTO[] | EditorNoteConcept[] | undefined;
}

const SimpleVersionPanel = ({ editorNotes }: Props) => {
  const { t } = useTranslation();
  const numNotes = editorNotes?.length ?? 0;

  const [users, setUsers] = useState<SimpleUserType[]>([]);
  const [loading, setLoading] = useState(numNotes > 0);

  const cleanupNotes = useCallback(
    (notes: EditorNoteDTO[] | EditorNoteConcept[]) =>
      notes.map((note, idx) => {
        const commonFields = {
          author: getUser(note.updatedBy, users),
          date: formatDate(note.timestamp),
          id: idx,
        };
        if ("status" in note) {
          return {
            ...note,
            ...commonFields,
            status: t(`form.status.actions.${note.status.current}`),
          };
        }
        return {
          ...note,
          ...commonFields,
        };
      }),
    [t, users],
  );

  useEffect(() => {
    let shouldUpdate = true;
    if (numNotes > 0) {
      const notes = editorNotes ?? [];
      const userIds = notes.map((note) => note.updatedBy).filter((user) => user !== "System");
      fetchAuth0UsersFromUserIds(userIds, setUsers).then(() => {
        if (shouldUpdate) setLoading(false);
      });
    }

    return () => {
      shouldUpdate = false;
    };
  }, [editorNotes, numNotes]);

  if (loading) return <Spinner />;

  const cleanedNotes = cleanupNotes(editorNotes ?? []);

  return <VersionHistory notes={cleanedNotes} />;
};

export default SimpleVersionPanel;
