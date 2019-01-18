/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { FormHeader } from '@ndla/forms';
import { formClasses } from '..';
import { PossibleStatusShape } from '../../../shapes';
import * as articleStatuses from '../../../util/constants/ArticleStatus';

const isAdminStatus = status =>
  status === articleStatuses.PUBLISHED ||
  status === articleStatuses.UNPUBLISHED;

function AdminActions({ possibleStatuses, articleStatus, onUpdateStatus, t }) {
  if (possibleStatuses[articleStatus.current].find(isAdminStatus)) {
    return (
      <div {...formClasses('actions')}>
        {possibleStatuses[articleStatus.current].map(status => {
          if (
            status === articleStatuses.PUBLISHED ||
            status === articleStatuses.UNPUBLISHED
          ) {
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
  const { t, articleStatus, possibleStatuses, onUpdateStatus } = props;
  if (
    !possibleStatuses ||
    possibleStatuses.length === 0 ||
    !possibleStatuses[articleStatus.current]
  ) {
    return null;
  }

  return (
    <Fragment>
      <FormHeader title={t('form.workflow.change')} width={3 / 4} />
      <div {...formClasses('actions')}>
        {possibleStatuses[articleStatus.current]
          .filter(
            status =>
              !isAdminStatus(status) && articleStatus.current !== status,
          )
          .map(status => (
            <Button
              key={`status_action_${status}`}
              onClick={() => onUpdateStatus(status)}>
              {t(`form.status.actions.${status}`)}
            </Button>
          ))}
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
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  onUpdateStatus: PropTypes.func.isRequired,
  possibleStatuses: PossibleStatusShape.isRequired,
};

FormStatusActions.defaultProps = {
  articleStatus: {
    current: '',
    other: [],
  },
};

export default injectT(FormStatusActions);
