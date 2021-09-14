/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { Check } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import HeaderLanguagePill from './HeaderLanguagePill';

interface LinkWithReplaceProps {
  to: string;
}

const LinkWithReplace = ({ to, ...rest }: LinkWithReplaceProps) => {
  let history = useHistory();
  return <Link to={{ pathname: to, state: history.location.state }} replace {...rest} />;
};

interface Props {
  id: number;
  language: string;
  editUrl: (url: string) => string;
  supportedLanguages?: string[];
  isSubmitting?: boolean;
  replace?: boolean;
}

const HeaderSupportedLanguages = ({
  supportedLanguages = [],
  editUrl,
  isSubmitting,
  language,
  replace,
}: Props) => {
  const { t } = useTranslation();
  return (
    <>
      {supportedLanguages.map(supportedLanguage =>
        language === supportedLanguage ? (
          <HeaderLanguagePill current key={`types_${supportedLanguage}`}>
            <Check />
            {t(`language.${supportedLanguage}`)}
          </HeaderLanguagePill>
        ) : (
          <Tooltip
            key={`types_${supportedLanguage}`}
            tooltip={t('language.change', {
              language: t(`language.${supportedLanguage}`).toLowerCase(),
            })}>
            <HeaderLanguagePill
              to={editUrl(supportedLanguage)}
              withComponent={replace ? LinkWithReplace : Link}
              isSubmitting={isSubmitting}>
              {t(`language.${supportedLanguage}`)}
            </HeaderLanguagePill>
          </Tooltip>
        ),
      )}
    </>
  );
};

export default HeaderSupportedLanguages;
