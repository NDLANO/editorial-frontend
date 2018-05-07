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
        header={t('form.contentSection')}
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
        {!model.id ? (
          <InputFileField
            label={t('form.image.file')}
            name="imageFile"
            {...commonFieldProps}
          />
        ) : null}
        {model.imageFile && (
          <img src={model.filepath || model.imageFile} alt="" height="500" />
        )}
        <TextField
          placeholder={t(`form.image.caption.placeholder`)}
          label={t(`form.image.caption.label`)}
          name="caption"
          noBorder
          maxLength={300}
          {...commonFieldProps}
        />
        <TextField
          placeholder={t('form.image.alt.placeholder')}
          label={t('form.image.alt.label')}
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
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
};

export default injectT(ImageContent);
