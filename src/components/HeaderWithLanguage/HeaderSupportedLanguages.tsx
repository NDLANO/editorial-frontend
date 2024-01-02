/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Check } from '@ndla/icons/editor';
import SafeLink from '@ndla/safelink';
import HeaderLanguagePill from './HeaderLanguagePill';

interface LinkWithReplaceProps {
  to: string;
}

const LinkWithReplace = ({ to, ...rest }: LinkWithReplaceProps) => {
  return <SafeLink to={to} replace {...rest} />;
};

interface Props {
  id: number;
  language: string;
  editUrl: (id: number, url: string) => string;
  supportedLanguages?: string[];
  isSubmitting?: boolean;
  replace?: boolean;
}

const HeaderSupportedLanguages = ({ supportedLanguages = [], id, editUrl, isSubmitting, language, replace }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      {supportedLanguages.map((supportedLanguage) =>
        language === supportedLanguage ? (
          <HeaderLanguagePill current key={`types_${supportedLanguage}`}>
            <Check />
            {t(`languages.${supportedLanguage}`)}
          </HeaderLanguagePill>
        ) : (
          <HeaderLanguagePill
            aria-label={t('languages.change', {
              language: t(`languages.${supportedLanguage}`),
            })}
            title={t('languages.change', {
              language: t(`languages.${supportedLanguage}`),
            })}
            to={editUrl(id, supportedLanguage)}
            component={replace ? LinkWithReplace : SafeLink}
            isSubmitting={isSubmitting}
            key={`types_${supportedLanguage}`}
          >
            {t(`languages.${supportedLanguage}`)}
          </HeaderLanguagePill>
        ),
      )}
    </>
  );
};

export default HeaderSupportedLanguages;
