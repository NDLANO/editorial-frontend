/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext } from 'react';
import { spacing } from '@ndla/core';
import { Footer, LanguageSelector, FooterText, EditorName } from '@ndla/ui';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { injectT, tType } from '@ndla/i18n';
import { getLocaleUrls } from '../../../util/localeHelpers';
import { LocaleType } from '../../../interfaces';
import { LocaleContext } from '../App';

const StyledFooterWrapper = styled.div`
  margin-top: ${spacing.large};
`;

interface Props extends RouteComponentProps {
  location: RouteComponentProps['location'];
  showLocaleSelector?: boolean;
}

const FooterWrapper = ({ location, showLocaleSelector, t }: Props & tType) => {
  const locale: LocaleType = useContext(LocaleContext);
  const languageSelector = showLocaleSelector ? (
    <LanguageSelector
      center
      outline
      alwaysVisible
      options={getLocaleUrls(locale, location)}
      currentLanguage={locale}
    />
  ) : null;

  return (
    <StyledFooterWrapper>
      <Footer lang={locale} languageSelector={languageSelector}>
        <FooterText>
          <EditorName title={t('footer.footerEditiorInChief')} name="Sigurd Trageton" />
          {t('footer.footerInfo')}
        </FooterText>
      </Footer>
    </StyledFooterWrapper>
  );
};

export default withRouter(injectT(FooterWrapper));
