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
import { Audio } from '@ndla/icons/common';
import { ContentResultType } from '../../../../interfaces';
import { toEditAudio } from '../../../../util/routeHelpers';
import { AudioResultShape } from '../../../../shapes';
import { searchClasses } from '../../SearchContainer';

interface Props {
  audio: ContentResultType;
  locale: string;
}

const SearchAudio: React.FC<Props & tType> = ({ audio, locale, t }) => (
  <div {...searchClasses('result')}>
    <div {...searchClasses('image')}>
      <Audio />
    </div>
    <div {...searchClasses('content')}>
      <Link to={toEditAudio(audio.id, audio.title.language)}>
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
    </div>
  </div>
);

SearchAudio.propTypes = {
  audio: AudioResultShape.isRequired,
  locale: PropTypes.string.isRequired,
};

export default injectT(SearchAudio);
