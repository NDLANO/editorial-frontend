/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { Select, Option, SingleValue } from '@ndla/select';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateDraft } from '../../../modules/draft/draftApi';
import { useDraft } from '../../../modules/draft/draftQueries';
import { NodeResourceMeta } from '../../../modules/nodes/nodeQueries';
import { getIdFromUrn } from '../../../util/taxonomyHelpers';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { StyledErrorMessage } from '../../TaxonomyVersions/components/StyledErrorMessage';

const StyledWrapper = styled.div`
  flex: 2;
`;

interface Props {
  options: Option[];
  isLoading: boolean;
  meta?: NodeResourceMeta;
}

const ResponsibleSelect = ({ options, isLoading, meta }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const id = getIdFromUrn(meta?.contentUri);
  const { data: article } = useDraft({ id: id! }, { enabled: !!id });

  const [responsible, setResponsible] = useState<SingleValue>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const onChange = async (r: SingleValue) => {
    if (!r || !meta) return;

    setResponsible(r);

    try {
      const id = getIdFromUrn(meta.contentUri)!;
      await updateDraft(
        id,
        {
          responsibleId: r.value,
          revision: meta.revision!,
          notes: meta.notes?.map(n => n.note).concat('Ansvarlig oppdatert'),
        },
        taxonomyVersion,
      );
    } catch (e) {
      setError('form.responsible.error');
    }
  };
  console.log(article);
  console.log(meta);
  useEffect(() => {
    if (!responsible) {
      const initialResponsible =
        options.find(o => o.value === article?.responsible?.responsibleId) ?? null;
      setResponsible(initialResponsible);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  return (
    <StyledWrapper>
      <Select<false>
        small
        prefix={'Ansvarlig: '} // TODO: update from phrases
        placeholder={'Velg ansvarlig'}
        isSearchable
        noOptionsMessage={() => t('form.responsible.noResults')}
        isLoading={isLoading}
        options={options ?? []}
        closeMenuOnSelect
        value={responsible}
        onChange={onChange}
      />
      {error && <StyledErrorMessage>{t(error)}</StyledErrorMessage>}
    </StyledWrapper>
  );
};

export default ResponsibleSelect;
