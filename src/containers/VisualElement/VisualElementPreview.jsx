/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import DisplayEmbedTag from '../../components/DisplayEmbedTag/DisplayEmbedTag';
import MetaInformation from '../../components/MetaInformation';
import { getVisualElementInformation } from '../../util/visualElementHelper';
import * as api from './visualElementApi';
import { visualElementClasses } from '../TopicArticlePage/components/TopicArticleVisualElement';

class VisualElementPreview extends Component {
  constructor(props) {
    super(props);
    this.removeVisualElement = this.removeVisualElement.bind(this);
    this.state = {
      metaData: {},
    };
  }

  async componentDidMount() {
    const { value } = this.props;
    if (value.resource && value.resource !== 'h5p') {
      const metaData = await api.fetchVisualElement(value);
      this.setState({ metaData });
    }
  }

  removeVisualElement() {
    const { onChange, name, resetSelectedResource } = this.props;
    this.setState({ metaData: {} });
    onChange({ target: { name, value: {} } });
    resetSelectedResource();
  }

  render() {
    const { value, t, changeVisualElement } = this.props;
    const { metaData } = this.state;
    if (!value.resource) {
      return null;
    }

    const metaTranslations = {
      title: t(`topicArticleForm.visualElementTitle.${value.resource}`),
      copyright: t('topicArticleForm.visualElementCopyright'),
    };
    const resourceMetadata =
      value && value.metaData
        ? { ...value.metaData, dkdkd: 'FIRST' }
        : { ...metaData, dkdkd: 'SECOND' };
    const element = getVisualElementInformation(
      resourceMetadata,
      value.resource,
    );

    return (
      <div {...visualElementClasses('preview')}>
        <DisplayEmbedTag
          embedTag={value}
          changeVisualElement={changeVisualElement}
          onRemoveClick={this.removeVisualElement}
          {...visualElementClasses(value.resource)}
        />
        <MetaInformation {...element} translations={metaTranslations} />
      </div>
    );
  }
}

VisualElementPreview.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.shape({
    resource: PropTypes.string,
    metaData: PropTypes.object,
  }).isRequired,
  resetSelectedResource: PropTypes.func.isRequired,
  changeVisualElement: PropTypes.func.isRequired,
};

export default injectT(VisualElementPreview);
