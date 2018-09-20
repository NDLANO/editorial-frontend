/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { formClasses } from '..';
import { articleStatuses } from '../../../util/formHelper';

const isActive = (articleStatus, status) => {
  if (!articleStatus || !articleStatus.current || !articleStatus.other) {
    return false;
  }
  return (
    articleStatus.current === status.key ||
    articleStatus.other.includes(status.key)
  );
};

const FormStatusColumns = ({ articleStatus, t }) => (
  <div {...formClasses('status-columns')}>
    {articleStatuses.map(status => (
      <span
        key={status.key}
        {...formClasses(
          `status-${status.columnSize || 1}-column`,
          isActive(articleStatus, status) ? 'active' : '',
        )}>
        {t(`form.status.${status.key.toLowerCase()}`)}
      </span>
    ))}
  </div>
);

FormStatusColumns.propTypes = {
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default injectT(FormStatusColumns);
