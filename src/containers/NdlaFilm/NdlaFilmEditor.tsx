/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { OneColumn } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import NdlaFilmForm from './components/NdlaFilmForm';
import Spinner from '../../components/Spinner';
import { useFilmFrontpageQuery } from '../../modules/frontpage/filmQueries';
import { getDefaultLanguage } from '../../config';
import { isValidLocale } from '../../i18n';
import NotFound from '../NotFoundPage/NotFoundPage';

const NdlaFilmEditor = () => {
  const filmFrontpageQuery = useFilmFrontpageQuery();
  const { selectedLanguage } = useParams<'selectedLanguage'>();
  const selectedLangOrDefault = selectedLanguage ?? getDefaultLanguage();
  const { t } = useTranslation();

  if (!isValidLocale(selectedLangOrDefault)) {
    return <NotFound />;
  }

  if (!filmFrontpageQuery.data) {
    return <Spinner withWrapper />;
  }

  return (
    <OneColumn>
      <HelmetWithTracker title={t('htmlTitles.ndlaFilmPage')} />
      <NdlaFilmForm
        filmFrontpage={filmFrontpageQuery.data}
        selectedLanguage={selectedLangOrDefault}
      />
    </OneColumn>
  );
};

export default NdlaFilmEditor;
