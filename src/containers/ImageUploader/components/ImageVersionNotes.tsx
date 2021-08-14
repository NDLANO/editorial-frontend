/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { VersionLogTag, VersionHistory } from '@ndla/editor';
import { ImagePropType } from './ImageForm';
import { EditorNote } from '../../../modules/image/imageApiInterfaces';
import { fetchAuth0Users } from '../../../modules/auth0/auth0Api';
import Spinner from '../../../components/Spinner';
import formatDate from '../../../util/formatDate';

const getUser = (userId: string, allUsers: { id?: string; name?: string }[]): string => {
  const user = allUsers.find(user => user.id === userId) || {};
  return user.name ?? '';
};

const getUsersFromNotes = async (
  notes: EditorNote[],
  setUsers: (users: SimpleUserType[]) => void,
): Promise<void> => {
  const userIds = notes.map(note => note.updatedBy).filter(user => user !== 'System');
  const uniqueUserIds = Array.from(new Set(userIds)).join(',');
  const users = await fetchAuth0Users(uniqueUserIds);
  const systemUser = { id: 'System', name: 'System' };
  setUsers(
    users
      ? [...users.map(user => ({ id: user.app_metadata.ndla_id, name: user.name })), systemUser]
      : [systemUser],
  );
};

interface SimpleUserType {
  id: string;
  name: string;
}

interface Props {
  image?: ImagePropType;
}

const ImageVersionNotes = ({ image }: Props) => {
  const [users, setUsers] = useState<SimpleUserType[]>([]);
  const [loading, setLoading] = useState(true);

  const cleanupNotes = useCallback(
    (notes: EditorNote[]) =>
      notes.map(note => ({
        ...note,
        author: getUser(note.updatedBy, users),
        date: formatDate(note.timestamp),
      })),
    [users],
  );

  useEffect(() => {
    let shouldUpdate = true;
    if (image?.editorNotes?.length ?? 0 > 0) {
      getUsersFromNotes(image?.editorNotes ?? [], setUsers).then(r => {
        if (shouldUpdate) setLoading(false);
      });
    }

    return () => {
      shouldUpdate = false;
    };
  }, [image?.editorNotes]);

  if (loading) return <Spinner />;

  return <VersionHistory notes={cleanupNotes(image?.editorNotes ?? [])} />;
};

export default injectT(ImageVersionNotes);
