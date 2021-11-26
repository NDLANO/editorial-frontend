/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { InformationOutline } from '@ndla/icons/common';
import { spacing, fonts } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { AudioFormikType } from './AudioForm';

interface Props {
  values: AudioFormikType;
}

const InfoWrapper = styled.div`
  margin: 0 auto;
  padding: 10px;
  display: flex;
  font-size: ${fonts.sizes(14, 1.2)};
`;

const IconWrapper = styled.div`
  padding-right: ${spacing.xsmall};
  display: flex;
  align-items: center;
`;

const AudioFormInfo = ({ values }: Props) => {
  const {
    audioFile: { storedFile: { language: copiedLanguage } = {} },
    language,
  } = values;

  const { t, i18n } = useTranslation();

  if (!copiedLanguage) {
    return null;
  }

  const tCopiedLanguage =
    i18n.language === 'en'
      ? t('language.' + copiedLanguage)
      : t('language.' + copiedLanguage).toLowerCase();

  return (
    <div>
      {language !== copiedLanguage && (
        <InfoWrapper>
          <IconWrapper>
            <InformationOutline />
          </IconWrapper>
          {t('form.audio.copiedFrom', {
            language: tCopiedLanguage,
          })}
        </InfoWrapper>
      )}
    </div>
  );
};

export default AudioFormInfo;
