/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Article } from '@ndla/ui';
import { injectT } from '@ndla/i18n';

class PreviewDraft extends Component {
  componentDidMount() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }

  componentDidUpdate() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }

  render() {
    const { article, label, t } = this.props;
    if (!article) {
      return null;
    }

    return (
      <Article
        article={article}
        messages={{
          lastUpdated: t('article.lastUpdated'),
          edition: t('article.edition'),
          publisher: t('article.publisher'),
          label,
          useContent: t('article.useContent'),
          closeLabel: t('article.closeLabel'),
          additionalLabel: t('article.additionalLabel'),
          authorLabel: t('license.creditType.originator'),
          authorDescription: t('license.creditType.authorDesc'),
        }}
      />
    );
  }
}

PreviewDraft.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    title: PropTypes.string,
    introduction: PropTypes.string,
  }),
  label: PropTypes.string.isRequired,
};

export default injectT(PreviewDraft);
