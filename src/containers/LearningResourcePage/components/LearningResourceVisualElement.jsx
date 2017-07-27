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

const metaImageFields = {
  id: 'metaImageId',
  caption: 'metaImageCaption',
  alt: 'metaImageAlt',
};

class LearningResourceVisualElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVisualElement: false,
    };
    this.toggleShowVisualElement = this.toggleShowVisualElement.bind(this);
  }

  toggleShowVisualElement() {
    this.setState(prevState => ({
      showVisualElement: !prevState.showVisualElement,
    }));
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
          {...bindInput('metaImageId')}
          showVisualElement={this.state.showVisualElement}
          toggleShowVisualElement={this.toggleShowVisualElement}
          visualElementFields={metaImageFields}
        />
        {!metaImageTag.id
          ? <Button onClick={this.toggleShowVisualElement}>Velg bilde</Button>
          : ''}
        {metaImageTag.id
          ? <div>
              <TextField
                placeholder={t(
                  `learningResourceForm.fields.caption.placeholder.image`,
                )}
                label={t(`learningResourceForm.fields.caption.label.image`)}
                name="metaImageCaption"
                noBorder
                maxLength={300}
                {...commonFieldProps}
              />
              <TextField
                placeholder={t('learningResourceForm.fields.alt.placeholder')}
                label={t('learningResourceForm.fields.alt.label')}
                name="metaImageAlt"
                noBorder
                maxLength={300}
                {...commonFieldProps}
              />
            </div>
          : ''}
      </div>
    );
  }
}

LearningResourceVisualElement.propTypes = {
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: PropTypes.shape({
    schema: PropTypes.shape({
      fields: PropTypes.object.isRequired,
      isValid: PropTypes.bool.isRequired,
    }),
    submitted: PropTypes.bool.isRequired,
    bindInput: PropTypes.func.isRequired,
  }),
  metaImageTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
};

export default injectT(LearningResourceVisualElement);
