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
import { Button } from 'ndla-ui';
import { formClasses } from '..';
import { PossibleStatusShape } from '../../../shapes';

const isAdminStatus = status =>
  status === 'PUBLISHED' || status === 'UNPUBLISHED';

function AdminActions({ possibleStatuses, articleStatus, onUpdateStatus, t }) {
  if (possibleStatuses[articleStatus.current].find(isAdminStatus)) {
    return (
      <div {...formClasses('actions')}>
        {possibleStatuses[articleStatus.current].map(status => {
          if (status === 'PUBLISHED' || status === 'UNPUBLISHED') {
            return (
              <Button
                key={`status_action_${status}`}
                onClick={() => onUpdateStatus(status)}>
                {t(`form.status.actions.${status}`)}
              </Button>
            );
          }
          return null;
        })}
      </div>
    );
  }
  return null;
}

AdminActions.propTypes = {
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  onUpdateStatus: PropTypes.func.isRequired,
  possibleStatuses: PossibleStatusShape.isRequired,
};

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
    <Fragment>
      <span {...formClasses('title')}>{t('form.workflow.change')}</span>
      <div {...formClasses('actions')}>
        {possibleStatuses[articleStatus.current]
          .filter(status => !isAdminStatus(status))
          .map(status => (
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
      <AdminActions
        t={t}
        possibleStatuses={possibleStatuses}
        articleStatus={articleStatus}
        onUpdateStatus={onUpdateStatus}
      />
    </Fragment>
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
  possibleStatuses: PossibleStatusShape.isRequired,
};

FormStatusActions.defaultProps = {
  articleStatus: {
    current: '',
    other: [],
  },
};

export default injectT(FormStatusActions);
