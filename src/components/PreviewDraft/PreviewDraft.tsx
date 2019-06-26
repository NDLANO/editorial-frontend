/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
//@ts-ignore
import { Article, ContentTypeBadge } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { ArticleType, TranslateType } from '../../interfaces';

interface Props {
  article: ArticleType;
  t: TranslateType;
  label: string;
  contentType?: string;
}

class PreviewDraft extends Component<Props, {}> {
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
    const { article, contentType, label, t } = this.props;
    if (!article) {
      return null;
    }

    const icon = contentType ? (
      <ContentTypeBadge type={contentType} background size="large" />
    ) : null;

    return (
      <Article
        article={article}
        icon={icon}
        contentType={contentType}
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

export default injectT(PreviewDraft);
