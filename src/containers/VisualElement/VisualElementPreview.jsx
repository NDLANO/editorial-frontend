/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import DisplayEmbedTag from '../../components/DisplayEmbedTag/DisplayEmbedTag';
import MetaInformation from '../../components/MetaInformation';
import { getVisualElementInformation } from '../../util/visualElementHelper';
import * as api from './visualElementApi';
import { Field } from '../../components/Fields';
import { visualElementClasses } from '../TopicArticlePage/components/TopicArticleVisualElement';

class VisualElementPreview extends Component {
  constructor(props) {
    super(props);
    this.removeVisualElement = this.removeVisualElement.bind(this);
  }

  componentWillMount() {
    const { value, name, onChange } = this.props;

    if (value.resource && value.resource !== 'h5p') {
      api.fetchVisualElement(value).then(metaData => {
        onChange({
          target: {
            name,
            value: { ...value, metaData },
          },
        });
      });
    }
  }

  removeVisualElement() {
    const { onChange, name, resetSelectedResource } = this.props;

    onChange({ target: { name, value: {} } });
    resetSelectedResource();
  }

  render() {
    const { value, t, changeVisualElement } = this.props;
    if (!value.resource) {
      return null;
    }

    const metaTranslations = {
      title: t(`topicArticleForm.visualElementTitle.${value.resource}`),
      copyright: t('topicArticleForm.visualElementCopyright'),
    };
    const element = getVisualElementInformation(value.metaData, value.resource);
    return (
      <Field>
        <div {...visualElementClasses('preview')}>
          <DisplayEmbedTag
            embedTag={value}
            changeVisualElement={changeVisualElement}
            onRemoveClick={this.removeVisualElement}
            {...visualElementClasses(value.resource)}
          />
          <MetaInformation {...element} translations={metaTranslations} />
        </div>
      </Field>
    );
  }
}

VisualElementPreview.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  value: PropTypes.shape({
    resource: PropTypes.string,
    metaData: PropTypes.object,
  }).isRequired,
  resetSelectedResource: PropTypes.func.isRequired,
  changeVisualElement: PropTypes.func.isRequired,
};

export default injectT(VisualElementPreview);
