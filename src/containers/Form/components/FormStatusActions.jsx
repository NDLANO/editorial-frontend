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
    saveDraft,
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
        <Button onClick={() => onUpdateStatus(status)}>
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
      <Button onClick={saveDraft}>{t('form.save')}</Button>
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
  saveDraft: PropTypes.func.isRequired,
  onValidateClick: PropTypes.func.isRequired,
  possibleStatuses: PropTypes.arrayOf(PropTypes.object),
};

FormStatusActions.defaultProps = {
  articleStatus: [],
};

export default injectT(FormStatusActions);
