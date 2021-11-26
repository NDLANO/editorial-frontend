/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { spacing } from '@ndla/core';
import { Footer, LanguageSelector, FooterText, EditorName } from '@ndla/ui';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { getLocaleUrls } from '../../../util/localeHelpers';
import { LocaleType } from '../../../interfaces';

const StyledFooterWrapper = styled.div`
  margin-top: ${spacing.large};
`;

interface Props extends RouteComponentProps {
  location: RouteComponentProps['location'];
  showLocaleSelector?: boolean;
}

const FooterWrapper = ({ location, showLocaleSelector }: Props) => {
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

export default withRouter(FooterWrapper);
