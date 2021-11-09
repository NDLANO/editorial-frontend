/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { OneColumn } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import NdlaFilmForm from './components/NdlaFilmForm';
import Spinner from '../../components/Spinner';
import { LocaleType } from '../../interfaces';
import { useFilmFrontpageQuery } from './filmQueries';

interface Props {
  selectedLanguage: LocaleType;
}

const NdlaFilmEditor = ({ selectedLanguage }: Props) => {
  const filmFrontpageQuery = useFilmFrontpageQuery();
  // const slideshowIds = filmFrontpageQuery.data?.slideshow;
  // const slideshowQuery = useSlideshowQuery(slideshowIds!, { enabled: !!slideshowIds });

  const { t } = useTranslation();

  if (!filmFrontpageQuery.data) {
    return <Spinner withWrapper />;
  }

  return (
    <OneColumn>
      <HelmetWithTracker title={t('htmlTitles.ndlaFilmPage')} />
      <NdlaFilmForm filmFrontpage={filmFrontpageQuery.data} selectedLanguage={selectedLanguage} />
    </OneColumn>
  );
};

export default NdlaFilmEditor;
