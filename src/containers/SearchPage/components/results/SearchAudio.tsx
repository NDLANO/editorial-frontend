/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LicenseByline, getLicenseByAbbreviation } from '@ndla/licenses';
import { colors } from '@ndla/core';
import { Audio, Podcast } from '@ndla/icons/common';
import { IAudioSummary } from '@ndla/types-audio-api';
import { toEditAudio, toEditPodcast } from '../../../../util/routeHelpers';
import { useLicenses } from '../../../../modules/draft/draftQueries';
import {
  StyledSearchContent,
  StyledSearchDescription,
  StyledSearchImageContainer,
  StyledSearchOtherLink,
  StyledSearchResult,
  StyledSearchTitle,
} from '../form/StyledSearchComponents';

interface Props {
  audio: IAudioSummary;
  locale: string;
}

const SearchAudio = ({ audio, locale }: Props) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses();
  const license = licenses && licenses.find(l => audio.license === l.license);
  return (
    <StyledSearchResult>
      <StyledSearchImageContainer>
        {audio.audioType === 'podcast' ? <Podcast /> : <Audio />}
      </StyledSearchImageContainer>
      <StyledSearchContent>
        <Link
          to={
            audio.audioType === 'podcast'
              ? toEditPodcast(audio.id, audio.title.language)
              : toEditAudio(audio.id, audio.title.language)
          }>
          <StyledSearchTitle>{audio.title.title || t('audioSearch.noTitle')}</StyledSearchTitle>
        </Link>
        <StyledSearchDescription>
          {`${t('searchPage.language')}: `}
          {audio.supportedLanguages?.map(lang => (
            <StyledSearchOtherLink key={lang}>{t(`language.${lang}`)}</StyledSearchOtherLink>
          ))}
        </StyledSearchDescription>
        {license && (
          <LicenseByline
            licenseRights={getLicenseByAbbreviation(license.license, locale).rights}
            locale={locale}
            color={colors.brand.grey}
          />
        )}
      </StyledSearchContent>
    </StyledSearchResult>
  );
};

export default SearchAudio;
