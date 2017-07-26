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
  RichTextField,
  PlainTextField,
  RemainingCharacters,
} from '../../../components/Fields';
import Accordion from '../../../components/Accordion';
import LearningResourceVisualElement from './LearningResourceVisualElement';

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
    const { t, bindInput, commonFieldProps, model } = this.props;

    const metaImageTag = {
      resource: 'image',
      id: model.metaImageId,
      caption: model.metaImageCaption,
      alt: model.metaImageAlt,
    };
    console.log(metaImageTag)

    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('learningResourceForm.content')}
        hidden={this.state.hiddenContent}>
        <TextField
          label={t('learningResourceForm.fields.title.label')}
          name="title"
          big
          noBorder
          placeholder={t('learningResourceForm.fields.title.label')}
          {...commonFieldProps}
        />
        <PlainTextField
          label={t('learningResourceForm.fields.introduction.label')}
          placeholder={t('learningResourceForm.fields.introduction.label')}
          name="introduction"
          noBorder
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
        <LearningResourceVisualElement
          metaImageTag={metaImageTag}
          commonFieldProps={commonFieldProps}
          bindInput={bindInput}
        />

        <RichTextField
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
  model: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: PropTypes.shape({
    schema: PropTypes.shape({
      fields: PropTypes.object.isRequired,
      isValid: PropTypes.bool.isRequired,
    }),
    submitted: PropTypes.bool.isRequired,
    bindInput: PropTypes.func.isRequired,
  }),
  classes: PropTypes.func.isRequired,
};

export default injectT(LearningResourceContent);
