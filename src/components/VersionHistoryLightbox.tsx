/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { VersionHistory } from '@ndla/editor';
import { ContentTypeBadge } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { IEditorNote } from '@ndla/types-draft-api';

import Lightbox from './Lightbox';
import Spinner from './Spinner';
import ResourceItemLink from '../containers/StructurePage/resourceComponents/ResourceItemLink';
import { fetchDraftHistory } from '../modules/draft/draftApi';
import { fetchAuth0Users } from '../modules/auth0/auth0Api';
import formatDate from '../util/formatDate';
import { getIdFromUrn } from '../util/taxonomyHelpers';
import { Auth0UserData } from '../interfaces';

const StyledResourceLinkContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledBadge = styled.div`
  margin-right: ${spacing.small};
`;

interface VersionHistoryNotes {
  id: number;
  note: string;
  author: string;
  date: string;
  status: string;
}

interface Props {
  onClose: () => void;
  contentUri?: string;
  contentType?: string;
  name?: string;
  isVisible?: boolean;
  locale: string;
}

const VersionHistoryLightBox = ({
  onClose,
  contentUri,
  contentType,
  name,
  isVisible,
  locale,
}: Props) => {
  const [notes, setNotes] = useState<VersionHistoryNotes[] | undefined>(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    const cleanupNotes = (notes: IEditorNote[], users: Auth0UserData[]) =>
      notes.map((note, index) => ({
        id: index,
        note: note.note,
        author: users.find(user => user.app_metadata.ndla_id === note.user)?.name || '',
        date: formatDate(note.timestamp),
        status: t(`form.status.${note.status.current.toLowerCase()}`),
      }));

    const fetchHistory = async (id: number) => {
      const versions = await fetchDraftHistory(id);
      const notes: IEditorNote[] = versions?.[0]?.notes;
      if (notes?.length) {
        const userIds = notes.map(note => note.user).filter(user => user !== 'System');
        const uniqueUserIds = Array.from(new Set(userIds)).join(',');
        const users = await fetchAuth0Users(uniqueUserIds);
        setNotes(cleanupNotes(notes, users));
      } else {
        setNotes([]);
      }
    };
    const id = getIdFromUrn(contentUri);
    if (id) {
      fetchHistory(id);
    }
  }, [contentUri, t]);

  return (
    <Lightbox onClose={onClose} display width="800px" appearance="modal" severity="info">
      <StyledResourceLinkContainer>
        {contentType && (
          <StyledBadge>
            <ContentTypeBadge
              background
              type={contentType === 'topic-article' ? 'topic' : contentType}
            />
          </StyledBadge>
        )}
        <ResourceItemLink
          contentType={contentType}
          contentUri={contentUri}
          locale={locale}
          name={name}
          isVisible={isVisible}
        />
      </StyledResourceLinkContainer>
      {notes ? <VersionHistory notes={notes} /> : <Spinner />}
    </Lightbox>
  );
};

export default VersionHistoryLightBox;
