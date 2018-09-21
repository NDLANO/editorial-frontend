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
import { formClasses } from '..';

const FormStatusActions = props => {
  const {
    t,
    articleStatus,
    model,
    possibleStatuses,
    onUpdateStatus,
    onValidateClick,
  } = props;
  if (
    !possibleStatuses ||
    possibleStatuses.length === 0 ||
    !possibleStatuses[articleStatus.current]
  ) {
    return null;
  }

  return (
    <div {...formClasses('actions')}>
      {possibleStatuses[articleStatus.current].map(status => (
        <Button
          key={`status_action_${status}`}
          onClick={() => onUpdateStatus(status)}>
          {t(`form.status.actions.${status}`)}
        </Button>
      ))}
      {model.id ? (
        <Button outline onClick={onValidateClick}>
          {t('form.validate')}
        </Button>
      ) : (
        ''
      )}
    </div>
  );
};

FormStatusActions.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  onUpdateStatus: PropTypes.func.isRequired,
  onValidateClick: PropTypes.func.isRequired,
  possibleStatuses: PropTypes.shape({
    CREATED: PropTypes.arrayOf(PropTypes.string),
    PROPOSAL: PropTypes.arrayOf(PropTypes.string),
    AWAITING_QUALITY_ASSURANCE: PropTypes.arrayOf(PropTypes.string),
    DRAFT: PropTypes.arrayOf(PropTypes.string),
    USER_TEST: PropTypes.arrayOf(PropTypes.string),
    IMPORTED: PropTypes.arrayOf(PropTypes.string),
    QUALITY_ASSURED: PropTypes.arrayOf(PropTypes.string),
    PUBLISHED: PropTypes.arrayOf(PropTypes.string),
    AWAITING_UNPUBLISHING: PropTypes.arrayOf(PropTypes.string),
    UNPUBLISHED: PropTypes.arrayOf(PropTypes.string),
    ARCHIEVED: PropTypes.arrayOf(PropTypes.string),
    QUEUED_FOR_PUBLISHING: PropTypes.arrayOf(PropTypes.string),
  }),
};

FormStatusActions.defaultProps = {
  articleStatus: {
    current: '',
    other: [],
  },
};

export default injectT(FormStatusActions);
