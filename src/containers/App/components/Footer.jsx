/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Footer } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import SelectLocale from '../../SelectLocale/SelectLocale';

const FooterWrapper = ({ t, showLocaleSelector, locale }) => (
  <Footer>
    {showLocaleSelector && (
      <form className="footer_form">
        <label className="footer_label footer--bold" htmlFor="language-select">
          {t('footer.selectLanguage')}
        </label>
        <SelectLocale
          locale={locale}
          id="language-select"
          className="footer_language-select"
        />
      </form>
    )}
    <Footer.Ruler />
    <Footer.Text>
      <Footer.Editor
        title={t('footer.footerEditiorInChief')}
        name="Christer Gundersen"
      />
      <Footer.Editor
        title={t('footer.footerManagingEditor')}
        name="Pål Frønsdal"
      />
    </Footer.Text>
    <Footer.Text>{t('footer.footerInfo')}</Footer.Text>
  </Footer>
);

FooterWrapper.propTypes = {
  showLocaleSelector: PropTypes.bool,
  locale: PropTypes.string.isRequired,
};

FooterWrapper.defaultProps = {
  showLocaleSelector: true,
};

export default injectT(FooterWrapper);
