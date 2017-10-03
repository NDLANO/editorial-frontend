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
import { InputFileField, TextField } from '../../../components/Fields';
import Accordion from '../../../components/Accordion';
import { CommonFieldPropsShape } from '../../../shapes';

class ImageContent extends Component {
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
    const { t, commonFieldProps, model } = this.props;
    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('imageForm.content')}
        hidden={this.state.hiddenContent}>
        <TextField
          label={t('form.title.label')}
          name="title"
          title
          noBorder
          maxLength={300}
          placeholder={t('form.title.label')}
          {...commonFieldProps}
        />
        <InputFileField
          label={t('imageForm.fields.imageFile.label')}
          name="imageFile"
          {...commonFieldProps}
        />
        {model.imageFile &&
          <img src={model.filepath || model.imageFile} alt="" height="500" />}
        <TextField
          placeholder={t(`imageForm.fields.caption.placeholder`)}
          label={t(`imageForm.fields.caption.label`)}
          name="caption"
          noBorder
          maxLength={300}
          {...commonFieldProps}
        />
        <TextField
          placeholder={t('imageForm.fields.alttext.placeholder')}
          label={t('imageForm.fields.alttext.label')}
          name="alttext"
          noBorder
          maxLength={300}
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

ImageContent.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  classes: PropTypes.func.isRequired,
  bindInput: PropTypes.func.isRequired,
  model: PropTypes.shape({
    id: PropTypes.string,
  }),
};

export default injectT(ImageContent);
