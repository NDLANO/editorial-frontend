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
import { FormHeader } from 'ndla-forms';
import Tag from '../../../components/Tag';

function FormStatusColumns({ articleStatus, t }) {
  if (!articleStatus || articleStatus.current.length === 0) {
    return null;
  }
  return (
    <div>
      <FormHeader title={t('form.workflow.title')} width={3 / 4} />
      <div style={{ display: 'flex' }}>
        <Tag modifier="wide">
          {t(`form.status.${articleStatus.current.toLowerCase()}`)}
        </Tag>
        {articleStatus.other.map(status => (
          <Tag key={status} modifier={['secondary', 'wide']}>
            {t(`form.status.${status.toLowerCase()}`)}
          </Tag>
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
