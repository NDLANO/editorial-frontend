/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectT, tType } from '@ndla/i18n';
import { LicenseByline, getLicenseByAbbreviation } from '@ndla/licenses';
import { colors } from '@ndla/core';
import { Audio, Podcast } from '@ndla/icons/common';
import { AudioSearchResultType } from '../../../../modules/audio/audioApiInterfaces';
import { toEditAudio, toEditPodcast } from '../../../../util/routeHelpers';
import { AudioResultShape, LicensesArrayOf } from '../../../../shapes';
import { License } from '../../../../interfaces';
import { searchClasses } from '../../SearchContainer';

interface Props {
  audio: AudioSearchResultType;
  locale: string;
  licenses: License[];
}

const SearchAudio = ({ audio, locale, licenses, t }: Props & tType) => {
  const license = licenses && licenses.find(l => audio.license === l.license);
  return (
    <div {...searchClasses('result')}>
      <div {...searchClasses('image')}>
        {audio.audioType === 'podcast' ? <Podcast /> : <Audio />}
      </div>
      <div {...searchClasses('content')}>
        <Link
          to={
            audio.audioType === 'podcast'
              ? toEditPodcast(audio.id, audio.title.language)
              : toEditAudio(audio.id, audio.title.language)
          }>
          <h1 {...searchClasses('title')}>{audio.title.title || t('audioSearch.noTitle')}</h1>
        </Link>
        <p {...searchClasses('description')}>
          {`${t('searchPage.language')}: `}
          {audio.supportedLanguages?.map(lang => (
            <span key={lang} {...searchClasses('other-link')}>
              {t(`language.${lang}`)}
            </span>
          ))}
        </p>
        {license && (
          <LicenseByline
            licenseRights={getLicenseByAbbreviation(license.license, locale).rights}
            locale={locale}
            color={colors.brand.grey}
          />
        )}
      </div>
    </div>
  );
};

SearchAudio.propTypes = {
  audio: AudioResultShape.isRequired,
  locale: PropTypes.string.isRequired,
  licenses: LicensesArrayOf,
};

export default injectT(SearchAudio);
