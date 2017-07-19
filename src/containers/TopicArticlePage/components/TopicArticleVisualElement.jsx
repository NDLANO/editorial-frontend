/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { injectT } from '../../../i18n';
import { TextField, classes } from '../../../components/Fields';
import VisualElementSelectField from '../../VisualElement/VisualElementSelectField';
import VisualElementTypeSelect from '../../VisualElement/VisualElementTypeSelect';

class TopicArticleVisualElement extends Component {
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
    const { t, bindInput, commonFieldProps, visualElementTag } = this.props;
    const { schema, submitted } = commonFieldProps;

    return (
      <div>
        <div {...classes('add-visual-element-title')}>
          <span>
            {t('topicArticleForm.fields.visualElement.title')}
            <div {...classes('add-visual-element-title', 'border')} />
          </span>
        </div>
        <VisualElementTypeSelect
          schema={schema}
          submitted={submitted}
          embedTag={visualElementTag}
          toggleShowVisualElement={this.toggleShowVisualElement}
          {...bindInput('visualElementType')}
        />
        <VisualElementSelectField
          label={t('topicArticleForm.fields.visualElement.label')}
          schema={schema}
          submitted={submitted}
          embedTag={visualElementTag}
          {...bindInput('visualElementId')}
          showVisualElement={this.state.showVisualElement}
          toggleShowVisualElement={this.toggleShowVisualElement}
        />
        {visualElementTag.id
          ? <div>
              <TextField
                placeholder={t(`topicArticleForm.fields.caption.placeholder.${visualElementTag.resource}`)}
                label={t(`topicArticleForm.fields.caption.label.${visualElementTag.resource}`)}
                name="visualElementCaption"
                noBorder
                maxLength={300}
                {...commonFieldProps}
              />
              <TextField
                placeholder={t('topicArticleForm.fields.alt.placeholder')}
                label={t('topicArticleForm.fields.alt.label')}
                name="visualElementAlt"
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

TopicArticleVisualElement.propTypes = {
  bindInput: PropTypes.func.isRequired,
  commonFieldProps: PropTypes.shape({
    schema: PropTypes.shape({
      fields: PropTypes.object.isRequired,
      isValid: PropTypes.bool.isRequired,
    }),
    submitted: PropTypes.bool.isRequired,
    bindInput: PropTypes.func.isRequired,
  }),
  visualElementTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
};

export default injectT(TopicArticleVisualElement);
