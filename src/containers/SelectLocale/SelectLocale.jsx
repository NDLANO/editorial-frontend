/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { createBrowserHistory as createHistory } from 'history';
import { LocaleContext } from '../App/App';

import { appLocales } from '../../i18n';
import { LocationShape } from '../../shapes';

const SelectLocale = ({ location: { pathname, search } }) => {
  const locale = useContext(LocaleContext);
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
  location: LocationShape,
};

export default withRouter(SelectLocale);
