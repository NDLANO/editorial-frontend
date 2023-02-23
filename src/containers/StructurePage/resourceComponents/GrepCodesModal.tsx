/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Spinner from '../../../components/Spinner';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { useUpdateDraftMutation } from '../../../modules/draft/draftMutations';
import { draftQueryKey, useDraft } from '../../../modules/draft/draftQueries';
import { getIdFromUrn } from '../../../util/taxonomyHelpers';
import GrepCodesForm from './GrepCodesForm';

interface Props {
  contentUri: string;
  onClose: (newGrepCodes?: string[]) => void;
}
const GrepCodesModal = ({ contentUri, onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const draftId = getIdFromUrn(contentUri);
  const { data, isInitialLoading } = useDraft(
    { id: draftId!, language: i18n.language },
    { enabled: !!draftId },
  );
  const updateDraft = useUpdateDraftMutation();
  const qc = useQueryClient();

  if (!data || !draftId) {
    return null;
  }

  const onUpdateGrepCodes = async (newCodes: string[]) => {
    await updateDraft.mutateAsync(
      { id: draftId, body: { grepCodes: newCodes, revision: data.revision } },
      {
        onSuccess: data => {
          const key = draftQueryKey({ id: draftId!, language: i18n.language! });
          qc.cancelQueries(key);
          qc.setQueryData(key, data);
          qc.invalidateQueries(key);
        },
      },
    );
  };

  return (
    <TaxonomyLightbox
      title={t('form.name.grepCodes')}
      onClose={() => onClose(data?.grepCodes)}
      wide>
      {isInitialLoading ? (
        <Spinner />
      ) : (
        <GrepCodesForm article={data!} onUpdate={onUpdateGrepCodes} />
      )}
    </TaxonomyLightbox>
  );
};

export default GrepCodesModal;
