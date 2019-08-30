/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createBrowserHistory as createHistory } from 'history';

import { appLocales } from '../../i18n';
import { getLocale } from '../../modules/locale/locale';
import { LocationShape } from '../../shapes';

const SelectLocale = ({ locale, location: { pathname, search } }) => {
  const handleChange = newLocale => {
    const path = pathname.startsWith('/') ? pathname.substring(1) : pathname;
    createHistory().push(`/${newLocale}/${path}${search}`); // Need create new history or else basename is included
    window.location.reload();
  };

  return (
    <select
      onChange={evt => {
        handleChange(evt.target.value);
      }}
      value={locale}>
      {appLocales.map(l => (
        <option key={l.abbreviation} value={l.abbreviation}>
          {l.name}
        </option>
      ))}
    </select>
  );
};

SelectLocale.propTypes = {
  locale: PropTypes.string.isRequired,
  location: LocationShape,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default withRouter(connect(mapStateToProps)(SelectLocale));
