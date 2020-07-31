/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Check } from '@ndla/icons/editor';
import { injectT } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import { Link, useHistory } from 'react-router-dom';
import HeaderLanguagePill from './HeaderLanguagePill';

const LinkWithReplace = ({ to, ...rest }) => {
  let history = useHistory();
  return (
    <Link
      to={{ pathname: to, state: history.location.state }}
      replace
      {...rest}
    />
  );
};

const HeaderSupportedLanguages = ({
  supportedLanguages,
  editUrl,
  isSubmitting,
  language,
  replace,
  t,
}) => {
  return supportedLanguages.map(supportedLanguage =>
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
  );
};

HeaderSupportedLanguages.defaultProps = {
  supportedLanguages: [],
};

HeaderSupportedLanguages.propTypes = {
  id: PropTypes.number,
  language: PropTypes.string,
  editUrl: PropTypes.func.isRequired,
  supportedLanguages: PropTypes.arrayOf(PropTypes.string),
  isSubmitting: PropTypes.bool,
};

LinkWithReplace.propTypes = {
  to: PropTypes.string,
};

export default injectT(HeaderSupportedLanguages);
