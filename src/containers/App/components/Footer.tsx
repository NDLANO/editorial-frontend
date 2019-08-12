/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { spacing } from '@ndla/core';
import { Footer, LanguageSelector, FooterText, EditorName } from '@ndla/ui';
import { Facebook, Twitter, EmailOutline } from '@ndla/icons/common';
import { LocationState } from 'history';
import { withRouter } from 'react-router-dom';
import styled from '@emotion/styled';
//@ts-ignore
import { injectT } from '@ndla/i18n';
import { getLocaleUrls } from '../../../util/localeHelpers';
import { getLocale } from '../../../modules/locale/locale';
import { TranslateType } from '../../../interfaces';

const StyledFooterWrapper = styled.div`
  margin-top: ${spacing.large};
`;

interface Props {
  location: LocationState;
  locale: string;
  t: TranslateType;
  showLocaleSelector?: boolean;
}

export const FooterWrapper: FC<Props> = ({
  location,
  locale,
  showLocaleSelector,
  t,
}) => {
  const languageSelector = showLocaleSelector ? (
    <LanguageSelector
      center
      outline
      alwaysVisible
      options={getLocaleUrls(locale, location)}
      currentLanguage={locale}
    />
  ) : null;

  const links = [
    {
      to: 'https://www.facebook.com/ndla.no',
      text: t('footer.socialMediaLinks.facebook'),
      icon: <Facebook />,
    },
    {
      to: 'https://twitter.com/ndla_no',
      text: t('footer.socialMediaLinks.twitter'),
      icon: <Twitter />,
    },
    {
      to: 'https://om.ndla.no/nyhetsbrev/',
      text: t('footer.socialMediaLinks.newsletter'),
      icon: <EmailOutline />,
    },
  ];

  return (
    <StyledFooterWrapper>
      <Footer lang={locale} links={links} languageSelector={languageSelector}>
        <FooterText>
          <EditorName
            title={t('footer.footerEditiorInChief')}
            name="Sigurd Trageton"
          />
          {t('footer.footerInfo')}
        </FooterText>
      </Footer>
    </StyledFooterWrapper>
  );
};

const mapStateToProps = (state: { locale: string }) => ({
  locale: getLocale(state),
});

export default compose<any>(
  injectT,
  withRouter,
  connect(
    mapStateToProps,
    null,
  ),
)(FooterWrapper);
