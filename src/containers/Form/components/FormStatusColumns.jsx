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
import Tag from '../../../components/Tag';

function FormStatusColumns({ articleStatus, t }) {
  return (
    <div>
      <span {...formClasses('title')}>{t('form.workflow.current')}</span>
      <div style={{ display: 'flex' }}>
        <Tag>{t(`form.status.${articleStatus.current.toLowerCase()}`)}</Tag>
      </div>
      <span {...formClasses('subtitle')}>{t('form.workflow.completed')}</span>
      <div style={{ display: 'flex' }}>
        {articleStatus.other.map(status => (
          <Tag key={status}>{t(`form.status.${status.toLowerCase()}`)}</Tag>
        ))}
      </div>
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
