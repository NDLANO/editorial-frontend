/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { formClasses } from '..';
import Tag from '../../../components/Tag';

function FormStatusColumns({ articleStatus, t }) {
  return (
    <div>
      <span {...formClasses('title')}>{t('form.workflow.current')}</span>
      <div style={{ display: 'flex' }}>
        <Tag>{t(`form.status.${articleStatus.current.toLowerCase()}`)}</Tag>
      </div>
      {articleStatus.other.length > 0 && (
        <Fragment>
          <span {...formClasses('subtitle')}>{t('form.workflow.former')}</span>
          <div style={{ display: 'flex' }}>
            {articleStatus.other.map(status => (
              <Tag key={status}>{t(`form.status.${status.toLowerCase()}`)}</Tag>
            ))}
          </div>
        </Fragment>
      )}
    </div>
  );
}

FormStatusColumns.propTypes = {
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default injectT(FormStatusColumns);
