/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { IUpdatedAgreement, INewAgreement } from '@ndla/types-draft-api';
import AgreementForm from './components/AgreementForm';

interface Props {
  upsertAgreement: (agreement: IUpdatedAgreement | INewAgreement, id?: number) => Promise<void>;
}

const CreateAgreement = ({ upsertAgreement }: Props) => (
  <AgreementForm onUpsert={upsertAgreement} />
);

export default CreateAgreement;
