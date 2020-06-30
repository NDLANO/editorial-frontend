import { useEffect, useState } from 'react';
import * as taxonomyApi from '../../modules/taxonomy/taxonomyApi';
import * as frontpageApi from '../../modules/frontpage/frontpageApi';
import { fetchNewArticleId } from '../../modules/draft/draftApi';
import * as articleApi from '../../modules/article/articleApi';
import handleError from '../../util/handleError';
import { transformSubjectFromApiVersion } from '../../util/subjectHelpers';
import { ArticleType, SubjectpageType } from '../../interfaces';

export function useFetchSubjectpageData(subjectId: number, locale: string) {
  const [subjectpage, setSubjectpage] = useState<SubjectpageType>();
  const [loading, setLoading] = useState(false);

  const fetchSubject = async () => {
    if (subjectId) {
      setLoading(true);
      const subject = await taxonomyApi.fetchSubject(subjectId);
      const subjectpageId = subject.contentUri.split(':').pop() || '';
      try {
        const subjectpage = await frontpageApi.fetchSubjectFrontpage(
          subjectpageId,
        );
        //TODO: Er alle idene fra editors choices externalids?
        const externalIds = subjectpage.editorsChoices.map((x: string) =>
          x.split(':').pop(),
        );
        const articleIds = await fetchArticleIdsFromExternalIds(externalIds);
        const editorsChoices: ArticleType[] = await fetchEditorsChoices(
          articleIds,
        );
        setSubjectpage(
          transformSubjectFromApiVersion(
            subjectpage,
            articleIds,
            editorsChoices,
            subjectId,
          ),
        );
        setLoading(false);
      } catch (e) {
        handleError(e);
      }
    }
  };

  const fetchEditorsChoices = async (articleIds: number[]) => {
    const articleList: ArticleType[] = [];
    await Promise.all(
      articleIds.map(async articleId => {
        try {
          const article: ArticleType = await articleApi.getArticle(articleId);
          articleList.push(article);
        } catch (e) {
          handleError(e);
        }
      }),
    );
    return articleList;
  };

  const fetchArticleIdsFromExternalIds = async (externalIds: number[]) => {
    const articleIds: number[] = [];
    await Promise.all(
      externalIds.map(async (externalId: number) => {
        try {
          const id = await fetchNewArticleId(externalId);
          articleIds.push(id.id);
        } catch (e) {
          handleError(e);
        }
      }),
    );
    return articleIds;
  };

  useEffect(() => {
    fetchSubject();
  }, [subjectId]);

  return {
    subjectpage,
    loading,
    fetchEditorsChoices,
  };
}
