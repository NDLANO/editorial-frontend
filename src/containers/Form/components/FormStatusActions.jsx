/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { Button } from 'ndla-ui';
import { connect } from 'react-redux';
import { validateDraft } from '../../../modules/draft/draftApi';
import { actions as draftActions } from '../../../modules/draft/draft';
import * as messageActions from '../../Messages/messagesActions';
import { formClasses } from "..";
import { CommonFieldPropsShape } from '../../../shapes';
import { statuses } from '../../../tempStatusFile';

const  FormStatusActions = (props) => {
    const {
      t,
      saveDraft,
      articleStatus,
      model,
      onValidateClick,
    } = props;
    return (
        <div {...formClasses('actions')}>
          {statuses[articleStatus[0]].map(status => <Button>{t(`form.status.actions.${status}`)}</Button>)}
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
}

FormStatusActions.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
  articleStatus: PropTypes.arrayOf(PropTypes.string),
  addMessage: PropTypes.func.isRequired,
  publishDraft: PropTypes.func.isRequired,
  saveDraft: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  onValidateClick: PropTypes.func.isRequired,
};

FormStatusActions.defaultProps = {
  articleStatus: [],
};


export default injectT(FormStatusActions);
