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
import { Button } from 'ndla-ui';
import { classes } from './LearningResourceForm';

const LearningResourceHeader = props => {
  const { t, model } = props;

  if (!model.id) {
    return (
      <div {...classes('header')}>
        {t('learningResourceForm.title.create')}
      </div>
    );
  }


  return (
    <div {...classes('header')}>
      <span>{t('learningResourceForm.title.create')}</span>
      <span>
        <Button stripped>
          Lag variant +
        </Button>
      </span>
    </div>
  );
};

LearningResourceHeader.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
};

export default injectT(LearningResourceHeader);
