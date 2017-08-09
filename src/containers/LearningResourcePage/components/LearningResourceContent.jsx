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
import {
  TextField,
  PlainTextField,
  RemainingCharacters,
  RichBlockSlateField,
} from '../../../components/Fields';
import Accordion from '../../../components/Accordion';

class LearningResourceContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenContent: false,
    };
    this.toggleContent = this.toggleContent.bind(this);
  }

  toggleContent() {
    this.setState(prevState => ({
      hiddenContent: !prevState.hiddenContent,
    }));
  }

  render() {
    const { t, bindInput, commonFieldProps } = this.props;

    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('learningResourceForm.content')}
        hidden={this.state.hiddenContent}>
        <TextField
          label={t('learningResourceForm.fields.title.label')}
          name="title"
          bigText
          noBorder
          placeholder={t('learningResourceForm.fields.title.label')}
          {...commonFieldProps}
        />
        <PlainTextField
          label={t('learningResourceForm.fields.introduction.label')}
          placeholder={t('learningResourceForm.fields.introduction.label')}
          name="introduction"
          noBorder
          bigText
          maxLength={300}
          {...commonFieldProps}>
          <RemainingCharacters
            maxLength={300}
            getRemainingLabel={(maxLength, remaining) =>
              t('form.remainingCharacters', { maxLength, remaining })}
            value={bindInput('introduction').value
              .getCurrentContent()
              .getPlainText()}
          />
        </PlainTextField>
        <RichBlockSlateField
          noBorder
          label={t('learningResourceForm.fields.content.label')}
          placeholder={t('learningResourceForm.fields.content.placeholder')}
          name="content"
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

LearningResourceContent.propTypes = {
  commonFieldProps: PropTypes.shape({
    schema: PropTypes.shape({
      fields: PropTypes.object.isRequired,
      isValid: PropTypes.bool.isRequired,
    }),
    submitted: PropTypes.bool.isRequired,
  }),
  classes: PropTypes.func.isRequired,
  bindInput: PropTypes.func.isRequired,
};

export default injectT(LearningResourceContent);
