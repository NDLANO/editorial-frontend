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
import { TextField, classes } from '../../../components/Fields';
import VisualElementSelectField from '../../VisualElement/VisualElementSelectField';
import { MetaImageShape, CommonFieldPropsShape } from '../../../shapes';

class LearningResourceVisualElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVisualElement: false,
    };
    this.hideVisualElement = this.hideVisualElement.bind(this);
    this.showVisualElement = this.showVisualElement.bind(this);
  }

  showVisualElement() {
    this.setState({ showVisualElement: true });
  }

  hideVisualElement() {
    this.setState({ showVisualElement: false });
  }

  render() {
    const { t, bindInput, commonFieldProps, metaImageTag } = this.props;
    const { schema, submitted } = commonFieldProps;
    return (
      <div>
        <h3 {...classes('learning-resource-meta-image')}>
          {t('learningResourceForm.fields.metaImage.title')}
        </h3>
        <VisualElementSelectField
          label={t('learningResourceForm.fields.metaImage.label')}
          schema={schema}
          submitted={submitted}
          embedTag={metaImageTag}
          {...bindInput('metaImage')}
          selectedResource={this.state.showVisualElement ? 'image' : undefined}
          resetSelectedResource={this.hideVisualElement}
        />
        {metaImageTag.resource ? (
          <div>
            <TextField
              placeholder={t(`form.image.caption.placeholder`)}
              label={t(`form.image.caption.label`)}
              name="metaImage.caption"
              noBorder
              maxLength={300}
              {...commonFieldProps}
            />
            <TextField
              placeholder={t('form.image.alt.placeholder')}
              label={t('form.image.alt.label')}
              name="metaImage.alt"
              noBorder
              maxLength={300}
              {...commonFieldProps}
            />
          </div>
        ) : (
          <Button onClick={this.showVisualElement}>Velg bilde</Button>
        )}
      </div>
    );
  }
}

LearningResourceVisualElement.propTypes = {
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  metaImageTag: MetaImageShape,
};

export default injectT(LearningResourceVisualElement);
