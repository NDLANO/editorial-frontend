/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import { Footer, LanguageSelector, FooterText, EditorName } from '@ndla/ui';
import styled from '@emotion/styled';
import { getLocaleUrls } from '../../../util/localeHelpers';
import { LocaleType } from '../../../interfaces';

const StyledFooterWrapper = styled.div`
  margin-top: ${spacing.large};
`;

interface Props {
  showLocaleSelector?: boolean;
}

const FooterWrapper = ({ showLocaleSelector }: Props) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const languageSelector = showLocaleSelector ? (
    <LanguageSelector
      center
      outline
      alwaysVisible
      options={getLocaleUrls(i18n.language, location)}
      currentLanguage={i18n.language}
    />
  ) : null;

  return (
    <StyledFooterWrapper>
      <Footer lang={i18n.language as LocaleType} languageSelector={languageSelector}>
        <FooterText>
          <EditorName title={t('footer.footerEditiorInChief')} name="Sigurd Trageton" />
          {t('footer.footerInfo')}
        </FooterText>
      </Footer>
    </StyledFooterWrapper>
  );
};

export default FooterWrapper;
