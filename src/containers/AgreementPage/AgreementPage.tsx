/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { OneColumn } from '@ndla/ui';
import loadable from '@loadable/component';
import { createAgreement, updateAgreement } from '../../modules/draft/draftApi';
import { toEditAgreement } from '../../util/routeHelpers';
import Footer from '../App/components/Footer';
import { useMessages } from '../Messages/MessagesProvider';
import {
  NewAgreementApiType,
  UpdatedAgreementApiType,
} from '../../modules/draft/draftApiInterfaces';
const EditAgreement = loadable(() => import('./EditAgreement'));
const CreateAgreement = loadable(() => import('./CreateAgreement'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));

const AgreementPage = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { applicationError, createMessage } = useMessages();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const upsertAgreement = async (agreement: UpdatedAgreementApiType | NewAgreementApiType) => {
    try {
      setIsSaving(true);
      if ('id' in agreement) {
        await updateAgreement(agreement);
      } else {
        const newAgreement = await createAgreement(agreement as NewAgreementApiType);
        navigate(toEditAgreement(newAgreement.id));
      }
      setIsSaving(false);
      createMessage({
        translationKey: 'id' in agreement ? 'form.savedOk' : 'form.createdOk',
        severity: 'success',
      });
    } catch (err) {
      setIsSaving(false);
      applicationError(err);
    }
  };

  const locale = i18n.language;
  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.agreementPage')} />
      <OneColumn>
        <Routes>
          <Route
            path={'new'}
            element={
              <CreateAgreement
                locale={locale}
                isSaving={isSaving}
                upsertAgreement={upsertAgreement}
              />
            }
          />
          <Route
            path=":agreementId/edit"
            element={
              <EditAgreement
                locale={locale}
                isSaving={isSaving}
                upsertAgreement={upsertAgreement}
              />
            }
          />
          <Route element={<NotFoundPage />} />
        </Routes>
      </OneColumn>
      <Footer showLocaleSelector={false} />
    </>
  );
};

export default AgreementPage;
