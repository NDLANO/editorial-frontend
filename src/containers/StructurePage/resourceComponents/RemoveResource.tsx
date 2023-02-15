/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2, CloseButton } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { ModalBody, ModalHeaderV2 } from '@ndla/modal';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import Spinner from '../../../components/Spinner';
import { PUBLISHED, UNPUBLISHED } from '../../../constants';
import { updateStatusDraft } from '../../../modules/draft/draftApi';
import { fetchLearningpathsWithArticle } from '../../../modules/learningpath/learningpathApi';
import { ResourceWithNodeConnection } from '../../../modules/nodes/nodeApiTypes';
import { useDeleteResourceForNodeMutation } from '../../../modules/nodes/nodeMutations';
import { resourcesWithNodeConnectionQueryKey } from '../../../modules/nodes/nodeQueries';
import { getIdFromUrn } from '../../../util/taxonomyHelpers';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { ResourceWithNodeConnectionAndMeta } from './StructureResources';

interface Props {
  onClose: () => void;
  nodeId: string;
  deleteResource: ResourceWithNodeConnectionAndMeta;
}

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: ${spacing.small};
  justify-content: flex-end;
`;

const RightAlign = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ErrorText = styled.p`
  color: ${colors.support.red};
  margin-bottom: 0;
`;

const RemoveResource = ({ deleteResource, nodeId, onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const [error, setError] = useState<boolean>(false);
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();
  const articleId = useMemo(
    () =>
      deleteResource.contentUri?.includes('article')
        ? getIdFromUrn(deleteResource.contentUri)
        : undefined,
    [deleteResource.contentUri],
  );

  const compKey = useMemo(
    () =>
      resourcesWithNodeConnectionQueryKey({
        id: nodeId,
        language: i18n.language,
        taxonomyVersion,
      }),
    [i18n.language, nodeId, taxonomyVersion],
  );

  const { data, isLoading } = useQuery(
    ['contains-article', articleId],
    () => fetchLearningpathsWithArticle(articleId!),
    {
      enabled: !!articleId,
    },
  );

  const { mutateAsync, isLoading: isDeleting } = useDeleteResourceForNodeMutation({
    onMutate: async ({ id }) => {
      await qc.cancelQueries(compKey);
      const prevData = qc.getQueryData<ResourceWithNodeConnection[]>(compKey) ?? [];
      const withoutDeleted = prevData.filter(res => res.connectionId !== id);
      qc.setQueryData<ResourceWithNodeConnection[]>(compKey, withoutDeleted);
      return prevData;
    },
    onSuccess: () => qc.invalidateQueries(compKey),
  });

  const deleteText = useMemo(
    () =>
      data?.length || deleteResource.paths.length > 1
        ? t('taxonomy.resource.confirmDelete')
        : t('taxonomy.resource.confirmDeleteAndUnpublish'),
    [data?.length, t, deleteResource.paths],
  );

  const onDelete = async () => {
    try {
      setError(false);
      if (!data?.length && articleId && deleteResource.contentMeta?.status?.current === PUBLISHED) {
        await updateStatusDraft(articleId, UNPUBLISHED);
      }
      await mutateAsync({ id: deleteResource.connectionId, taxonomyVersion });
      onClose();
    } catch (e) {
      setError(true);
    }
  };

  return (
    <>
      <ModalHeaderV2>
        <h1>{t('taxonomy.removeResource')}</h1>
        <CloseButton onClick={onClose} />
      </ModalHeaderV2>
      <ModalBody>
        {isLoading ? <Spinner /> : deleteText}
        <RightAlign>
          <ButtonWrapper>
            <ButtonV2 variant="outline" onClick={onClose}>
              {t('form.abort')}
            </ButtonV2>
            <ButtonV2 colorTheme="danger" disabled={isLoading || isDeleting} onClick={onDelete}>
              {isDeleting ? <Spinner /> : t('form.remove')}
            </ButtonV2>
          </ButtonWrapper>
          {error && <ErrorText aria-live="assertive">{t('taxonomy.errorMessage')}</ErrorText>}
        </RightAlign>
      </ModalBody>
    </>
  );
};

export default RemoveResource;
