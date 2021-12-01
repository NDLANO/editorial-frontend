/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from 'react';
import { VersionHistory } from '@ndla/editor';
import { EditorNote, ImageApiType } from '../../../modules/image/imageApiInterfaces';
import { fetchAuth0UsersFromUserIds, SimpleUserType } from '../../../modules/auth0/auth0Api';
import Spinner from '../../../components/Spinner';
import formatDate from '../../../util/formatDate';

const getUser = (userId: string, allUsers: SimpleUserType[]): string => {
  const user = allUsers.find(user => user.id === userId);
  return user?.name ?? '';
};

interface Props {
  image?: ImageApiType;
}

const ImageVersionNotes = ({ image }: Props) => {
  const numNotes = image?.editorNotes?.length ?? 0;

  const [users, setUsers] = useState<SimpleUserType[]>([]);
  const [loading, setLoading] = useState(numNotes > 0);

  const cleanupNotes = useCallback(
    (notes: EditorNote[]) =>
      notes.map((note, idx) => ({
        ...note,
        author: getUser(note.updatedBy, users),
        date: formatDate(note.timestamp),
        id: idx,
      })),
    [users],
  );

  useEffect(() => {
    let shouldUpdate = true;
    if (numNotes > 0) {
      const notes = image?.editorNotes ?? [];
      const userIds = notes.map(note => note.updatedBy).filter(user => user !== 'System');
      fetchAuth0UsersFromUserIds(userIds, setUsers).then(r => {
        if (shouldUpdate) setLoading(false);
      });
    }

    return () => {
      shouldUpdate = false;
    };
  }, [image?.editorNotes, numNotes]);

  if (loading) return <Spinner />;

  const cleanedNotes = cleanupNotes(image?.editorNotes ?? []);

  return <VersionHistory notes={cleanedNotes} />;
};

export default ImageVersionNotes;
