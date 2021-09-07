import styled from '@emotion/styled';
import { InformationOutline } from '@ndla/icons/common';
import { breakpoints } from '@ndla/util';
import React from 'react';
import { spacing, colors, fonts } from '@ndla/core';
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
    audioFile: { storedFile: { language: fileLanguage } = {} },
    language,
  } = values;

  const { t, i18n } = useTranslation();

  return (
    <div>
      {fileLanguage && language !== fileLanguage && (
        <InfoWrapper>
          <IconWrapper>
            <InformationOutline />
          </IconWrapper>
          {t('form.audio.copiedFrom', {
            language:
              i18n.language === 'en'
                ? t('language.' + fileLanguage)
                : t('language.' + fileLanguage).toLowerCase(),
          })}
        </InfoWrapper>
      )}
    </div>
  );
};

export default AudioFormInfo;
