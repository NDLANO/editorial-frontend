/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IUpdatedAgreement, INewAgreement } from '@ndla/types-draft-api';
import AgreementForm from './components/AgreementForm';
import { fetchAgreement } from '../../modules/draft/draftApi';
import { useMessages } from '../Messages/MessagesProvider';

interface Props {
  upsertAgreement: (agreement: IUpdatedAgreement | INewAgreement, id?: number) => Promise<void>;
  locale: string;
  isSaving: boolean;
}

const EditAgreement = ({ upsertAgreement }: Props) => {
  const [agreement, setAgreement] = useState<any | undefined>(undefined);
  const { agreementId } = useParams<'agreementId'>();
  const { applicationError } = useMessages();

  useEffect(() => {
    (async () => {
      if (!agreementId) return;
      try {
        const fetchedAgreement = await fetchAgreement(Number(agreementId));
        setAgreement(fetchedAgreement);
      } catch (e) {
        applicationError(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agreementId]);

  if (!agreement) {
    return null;
  }
  return <AgreementForm agreement={agreement} onUpsert={upsertAgreement} />;
};

export default EditAgreement;
