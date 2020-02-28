/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';

import { fetchNnTranslation } from '../../modules/translate/translateApi';

export function useTranslateForm(article, setArticle) {
  const [translating, setTranslating] = useState(false);

  const translateArticle = async () => {
    setTranslating(true);
    const { id, title, metaDescription, introduction, content } = article;
    const translatedArticleContents = await fetchNnTranslation({
      id,
      title,
      metaDescription,
      introduction,
      content,
    });
    setArticle({
      ...article,
      ...translatedArticleContents.document,
      language: 'nn',
    });
    setTranslating(false);
  };

  return {
    translating,
    translateArticle
  }
  
}