/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { ButtonV2, CloseButton } from '@ndla/button';
import { spacing } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { ModalBody, ModalHeader, ModalTitle, Modal } from '@ndla/modal';
import { Node } from '@ndla/types-taxonomy';
import { TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH } from '../../../constants';
import { useUpdateNodeMetadataMutation } from '../../../modules/nodes/nodeMutations';
import { nodesQueryKey } from '../../../modules/nodes/nodeQueries';

interface Props {
  nodes: Node[];
}

const queryKey = nodesQueryKey({
  key: TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
  value: 'true',
  taxonomyVersion: 'default',
});

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const DeletePublishRequests = ({ nodes }: Props) => {
  const { t } = useTranslation();

  const { mutateAsync, isLoading } = useUpdateNodeMetadataMutation();
  const qc = useQueryClient();

  const onDelete = useCallback(
    async (nodes: Node[]) => {
      const promises = nodes.map(async ({ id, metadata }) => {
        const newMeta = { ...metadata, customFields: { ...metadata.customFields } };
        delete newMeta.customFields[TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH];
        await mutateAsync({ id, metadata: newMeta, taxonomyVersion: 'default' });
      });
      await Promise.all(promises);
      qc.invalidateQueries(queryKey);
      qc.setQueryData(queryKey, []);
    },
    [mutateAsync, qc],
  );

  return (
    <Modal
      activateButton={
        <ButtonV2 size="small" colorTheme="danger">
          {t('delete')}
        </ButtonV2>
      }
    >
      {(close) => (
        <>
          <ModalHeader>
            <ModalTitle>{t('publishRequests.deleteAll')}</ModalTitle>
            <CloseButton onClick={close} />
          </ModalHeader>
          <ModalBody>
            <p>{t('publishRequests.deleteAllInfo')}</p>
            <ButtonContainer>
              <ButtonV2 variant="outline" onClick={close}>
                {t('cancel')}
              </ButtonV2>
              <ButtonV2
                variant="outline"
                colorTheme="danger"
                onClick={() => onDelete(nodes)}
                disabled={isLoading}
              >
                {isLoading && <Spinner margin="0" size="small" />}
                {t('delete')}
              </ButtonV2>
            </ButtonContainer>
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default DeletePublishRequests;
