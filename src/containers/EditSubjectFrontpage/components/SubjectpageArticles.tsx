/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, useEffect, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import ElementList from '../../NdlaFilm/components/ElementList';
import DropdownSearch from '../../NdlaFilm/components/DropdownSearch';
import { ArticleType, TranslateType } from '../../../interfaces';
import { getArticle } from '../../../modules/article/articleApi';
import { fetchNewArticleId } from '../../../modules/draft/draftApi';

interface Props {
  t: TranslateType;
  articles: string[];
}

const SubjectpageArticles: FC<Props> = ({ t, articles }) => {
  const [content, setContent] = useState<ArticleType[]>([]);

  useEffect(() => {
    const fetchSubject = async () => {
      const externalIds = articles.map((x: any) => x.split(':').pop());
      var articleIds: any[] = [];
      var articleList: any[] = [];

      await Promise.all(
        externalIds.map(async externalId => {
          try {
            const id = await fetchNewArticleId(externalId);
            articleIds.push(id.id);
          } catch (e) {}
        }),
      );

      await Promise.all(
        articleIds.map(async id => {
          try {
            const article = await getArticle(id);
            articleList.push(article);
          } catch (e) {}
        }),
      );

      setContent(articleList);
    };
    fetchSubject();
  }, []);

  return (
    <>
      <FieldHeader
        title={t('subjectpageForm.editorsChoices')}
        subTitle={t('subjectpageForm.articles')}
      />
      <ElementList
    elements={content}
    data-cy="editors-choices-article-list"
    messages={{
        dragElements: t('ndlaFilm.editor.changeOrder'),
        removeElements: t('ndlaFilm.editor.removeMovieFromSlideshow'),
    }}
    onUpdateElements={() => {
        console.log('nå lagrer den');
    }}/>
      <DropdownSearch
        selectedElements={content}
        onChange={console.log('prøver å legge til?')}
        placeholder={t('subjectpageForm.addArticle')}
        subjectId={1}
      />
    </>
  );
};

export default injectT(SubjectpageArticles);
