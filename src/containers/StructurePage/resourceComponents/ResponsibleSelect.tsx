/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { Select, Option, SingleValue } from '@ndla/select';
import { IArticle } from '@ndla/types-draft-api';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateDraft } from '../../../modules/draft/draftApi';
import { useMessages } from '../../Messages/MessagesProvider';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';

const StyledWrapper = styled.div`
  flex: 2;
`;

interface Props {
  options: Option[];
  responsible: SingleValue;
  setResponsible: (r: SingleValue) => void;
  article?: IArticle;
}

const ResponsibleSelect = ({ options, responsible, setResponsible, article }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { createMessage } = useMessages();

  const [isLoading, setIsLoading] = useState(false);

  const onChange = async (r: SingleValue) => {
    if (!r || !article || r === responsible) return;

    try {
      setIsLoading(true);
      await updateDraft(
        article.id,
        {
          responsibleId: r.value,
          revision: article.revision ?? -1,
          notes: article.notes?.map(n => n.note).concat('Ansvarlig oppdatert'),
        },
        taxonomyVersion,
      );
      setResponsible(r);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      createMessage({
        message: t('form.responsible.error'),
        timeToLive: 0,
      });
    }
  };

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
        prefix={`${t('form.responsible.label')}: `}
        placeholder={t('form.responsible.choose')}
        isSearchable
        noOptionsMessage={() => t('form.responsible.noResults')}
        isLoading={isLoading}
        options={options ?? []}
        closeMenuOnSelect
        value={responsible}
        onChange={onChange}
      />
    </StyledWrapper>
  );
};

export default ResponsibleSelect;
