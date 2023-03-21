/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2, CloseButton } from '@ndla/button';
import { BookOpen } from '@ndla/icons/common';
import { spacing, colors } from '@ndla/core';
import { ModalBody, ModalHeaderV2, ModalV2 } from '@ndla/modal';
import { IArticle } from '@ndla/types-draft-api';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateDraftMutation } from '../../../modules/draft/draftMutations';
import { draftQueryKey } from '../../../modules/draft/draftQueries';
import { NodeResourceMeta, nodeResourceMetasQueryKey } from '../../../modules/nodes/nodeQueries';
import { getIdFromUrn } from '../../../util/taxonomyHelpers';
import GrepCodesForm from './GrepCodesForm';

interface Props {
  codes: string[];
  contentType: string;
  contentUri?: string;
  revision?: number;
  currentNodeId: string;
}

const StyledButton = styled(ButtonV2)`
  flex: 2;
`;

const StyledMenuBook = styled(BookOpen)``;

const StyledIconWrapper = styled.div`
  padding: ${spacing.small};
  border-radius: 50%;
  background-color: ${colors.brand.primary};
  display: flex;
  align-items: center;
  color: ${colors.white};
  margin-right: ${spacing.nsmall};
  svg {
    width: ${spacing.normal};
    height: ${spacing.normal};
  }
`;

const ModalHeader = styled(ModalHeaderV2)`
  display: flex;
  align-items: center;
  background-color: ${colors.brand.light};
`;

const GrepCodesModal = ({ codes, contentType, contentUri, revision, currentNodeId }: Props) => {
  const draftId = Number(getIdFromUrn(contentUri));
  if (contentType === 'learning-path' || !draftId || !revision) return null;
  return (
    <ModalV2
      size="large"
      activateButton={
        <StyledButton size="xsmall" colorTheme="lighter">{`GREP (${codes.length})`}</StyledButton>
      }
    >
      {close => (
        <ModalContent
          codes={codes}
          revision={revision}
          draftId={draftId}
          onClose={close}
          currentNodeId={currentNodeId}
          contentUri={contentUri!}
        />
      )}
    </ModalV2>
  );
};

interface ModalContentProps {
  codes: string[];
  draftId: number;
  revision: number;
  onClose: () => void;
  currentNodeId: string;
  contentUri: string;
}

const ModalContent = ({
  codes,
  draftId,
  revision,
  currentNodeId,
  contentUri,
}: ModalContentProps) => {
  const updateDraft = useUpdateDraftMutation();
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const key = useMemo(() => draftQueryKey({ id: draftId, language: i18n.language }), [
    i18n.language,
    draftId,
  ]);
  const nodeKey = useMemo(
    () => nodeResourceMetasQueryKey({ nodeId: currentNodeId, language: i18n.language }),
    [i18n.language, currentNodeId],
  );

  const onUpdateGrepCodes = useCallback(
    async (grepCodes: string[]) => {
      await updateDraft.mutateAsync(
        { id: draftId, body: { grepCodes, revision } },
        {
          onSuccess: data => {
            qc.cancelQueries(key);
            qc.setQueryData<IArticle>(key, data);
            qc.invalidateQueries(key);
            qc.setQueriesData<NodeResourceMeta[]>({ queryKey: nodeKey }, data =>
              data?.map(meta => (meta.contentUri === contentUri ? { ...meta, grepCodes } : meta)),
            );
          },
        },
      );
    },
    [updateDraft, draftId, revision, qc, key, nodeKey, contentUri],
  );
  return (
    <>
      <ModalHeader>
        <StyledIconWrapper>
          <BookOpen />
        </StyledIconWrapper>
        <h1>{t('form.name.grepCodes')}</h1>
        <CloseButton />
      </ModalHeader>
      <ModalBody>
        <GrepCodesForm codes={codes} onUpdate={onUpdateGrepCodes} />
      </ModalBody>
    </>
  );
};

export default GrepCodesModal;
