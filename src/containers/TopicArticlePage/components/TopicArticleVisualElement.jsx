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

import { TextField, classes } from '../../../components/Fields';
import VisualElementSelectField from '../../VisualElement/VisualElementSelectField';
import VisualElementMenu from '../../VisualElement/VisualElementMenu';
import { CommonFieldPropsShape } from '../../../shapes';

class TopicArticleVisualElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedResource: undefined,
    };
    this.handleSelectResource = this.handleSelectResource.bind(this);
    this.resetSelectedResource = this.resetSelectedResource.bind(this);
  }

  resetSelectedResource() {
    this.setState({ selectedResource: undefined });
  }

  handleSelectResource(selectedResource) {
    this.setState({ selectedResource });
  }

  render() {
    const { t, bindInput, commonFieldProps } = this.props;
    const { schema, submitted } = commonFieldProps;

    const { value: visualElement } = bindInput('visualElement');

    return (
      <div>
        <div {...classes('add-visual-element-title')}>
          <span>
            {t('form.visualElement.title')}
            <div {...classes('add-visual-element-title', 'border')} />
          </span>
        </div>
        {!visualElement.resource
          ? <VisualElementMenu
              onSelect={resource =>
                this.setState({ selectedResource: resource })}
            />
          : null}
        <VisualElementSelectField
          label={t('form.visualElement.label')}
          schema={schema}
          submitted={submitted}
          visualElement={visualElement}
          selectedResource={this.state.selectedResource}
          onRemoveVisualElement={() =>
            this.setState({ selectedResource: undefined })}
          {...bindInput('visualElement')}
          resetSelectedResource={this.resetSelectedResource}
        />
        {visualElement.resource && visualElement.resource !== 'h5p'
          ? <div>
              <TextField
                placeholder={t(
                  `topicArticleForm.fields.caption.placeholder.${visualElement.resource}`,
                )}
                label={t(
                  `topicArticleForm.fields.caption.label.${visualElement.resource}`,
                )}
                name="visualElement.caption"
                {...commonFieldProps}
                noBorder
                maxLength={300}
              />
              {visualElement.resource === 'image' &&
                <TextField
                  placeholder={t('topicArticleForm.fields.alt.placeholder')}
                  label={t('topicArticleForm.fields.alt.label')}
                  name="visualElement.alt"
                  {...commonFieldProps}
                  noBorder
                  maxLength={300}
                />}
            </div>
          : ''}
      </div>
    );
  }
}

TopicArticleVisualElement.propTypes = {
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: CommonFieldPropsShape.isRequired,
  visualElement: PropTypes.shape({
    caption: PropTypes.string,
    alt: PropTypes.string,
    id: PropTypes.string,
    resource: PropTypes.string,
  }),
};

export default injectT(TopicArticleVisualElement);
