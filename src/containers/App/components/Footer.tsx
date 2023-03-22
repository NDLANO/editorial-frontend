/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { spacing, colors } from '@ndla/core';
import { Footer, LanguageSelector, FooterText, EditorName } from '@ndla/ui';
import styled from '@emotion/styled';
import { supportedLanguages } from '../../../i18n2';

const StyledFooterWrapper = styled.div`
  margin-top: ${spacing.large};
  background-color: ${colors.brand.greyLightest};
`;

interface Props {
  showLocaleSelector?: boolean;
}

const FooterWrapper = ({ showLocaleSelector }: Props) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const languageSelector = showLocaleSelector ? (
    <LanguageSelector locales={supportedLanguages} onSelect={i18n.changeLanguage} inverted />
  ) : null;

  return (
    <StyledFooterWrapper>
      <Footer lang={i18n.language} languageSelector={languageSelector}>
        <FooterText>
          <EditorName title={t('footer.editorInChief')} name="Sigurd Trageton" />
          {t('footer.info')}
        </FooterText>
      </Footer>
    </StyledFooterWrapper>
  );
};

export default FooterWrapper;
