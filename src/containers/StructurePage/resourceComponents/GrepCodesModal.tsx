/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { BookOpen } from '@ndla/icons/common';
import { spacing, colors } from '@ndla/core';
import {
  ModalBody,
  ModalHeader,
  Modal,
  ModalTitle,
  ModalTrigger,
  ModalContent,
  ModalCloseButton,
} from '@ndla/modal';
import { IArticle } from '@ndla/types-backend/draft-api';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateDraftMutation } from '../../../modules/draft/draftMutations';
import { draftQueryKeys } from '../../../modules/draft/draftQueries';
import { NodeResourceMeta, nodeQueryKeys } from '../../../modules/nodes/nodeQueries';
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

const StyledModalHeader = styled(ModalHeader)`
  display: flex;
  align-items: center;
  background-color: ${colors.brand.light};
`;

const GrepCodesModal = ({ codes, contentType, contentUri, revision, currentNodeId }: Props) => {
  const draftId = Number(getIdFromUrn(contentUri));
  if (contentType === 'learning-path' || !draftId || !revision) return null;
  return (
    <Modal>
      <ModalTrigger>
        <StyledButton size="xsmall" colorTheme="lighter">{`GREP (${codes.length})`}</StyledButton>
      </ModalTrigger>
      <ModalContent size="large">
        <GrepCodeContent
          codes={codes}
          revision={revision}
          draftId={draftId}
          currentNodeId={currentNodeId}
          contentUri={contentUri!}
        />
      </ModalContent>
    </Modal>
  );
};

interface ModalContentProps {
  codes: string[];
  draftId: number;
  revision: number;
  currentNodeId: string;
  contentUri: string;
}

const GrepCodeContent = ({
  codes,
  draftId,
  revision,
  currentNodeId,
  contentUri,
}: ModalContentProps) => {
  const updateDraft = useUpdateDraftMutation();
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const key = useMemo(
    () => draftQueryKeys.draft({ id: draftId, language: i18n.language }),
    [i18n.language, draftId],
  );
  const nodeKey = useMemo(
    () => nodeQueryKeys.resourceMetas({ nodeId: currentNodeId, language: i18n.language }),
    [i18n.language, currentNodeId],
  );

  const onUpdateGrepCodes = useCallback(
    async (grepCodes: string[]) => {
      await updateDraft.mutateAsync(
        { id: draftId, body: { grepCodes, revision } },
        {
          onSuccess: (data) => {
            qc.cancelQueries(key);
            qc.setQueryData<IArticle>(key, data);
            qc.invalidateQueries(key);
            qc.setQueriesData<NodeResourceMeta[]>(
              { queryKey: nodeKey },
              (data) =>
                data?.map((meta) =>
                  meta.contentUri === contentUri ? { ...meta, grepCodes } : meta,
                ),
            );
          },
        },
      );
    },
    [updateDraft, draftId, revision, qc, key, nodeKey, contentUri],
  );
  return (
    <>
      <StyledModalHeader>
        <StyledIconWrapper>
          <BookOpen />
        </StyledIconWrapper>
        <ModalTitle>{t('form.name.grepCodes')}</ModalTitle>
        <ModalCloseButton />
      </StyledModalHeader>
      <ModalBody>
        <GrepCodesForm codes={codes} onUpdate={onUpdateGrepCodes} />
      </ModalBody>
    </>
  );
};

export default GrepCodesModal;
