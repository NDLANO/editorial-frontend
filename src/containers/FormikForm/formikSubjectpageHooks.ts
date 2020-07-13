import { useEffect, useState } from 'react';
import {FormikProps} from "formik";
import {Value} from "slate";
import * as taxonomyApi from '../../modules/taxonomy/taxonomyApi';
import * as frontpageApi from '../../modules/frontpage/frontpageApi';
import { fetchNewArticleId } from '../../modules/draft/draftApi';
import * as articleApi from '../../modules/article/articleApi';
import handleError from '../../util/handleError';
import {transformSubjectFromApiVersion, transformSubjectToApiVersion} from '../../util/subjectHelpers';
import {ArticleType, SubjectpageType, TranslateType} from '../../interfaces';
import Subjectpage from "../EditSubjectFrontpage/Subjectpage";
import * as messageActions from '../Messages/messagesActions';
import { formatErrorMessage } from '../../util/apiHelpers';

export function useSubjectpageFormHooks(subjectId: number, locale: string, t: TranslateType) {
  const [subjectpage, setSubjectpage] = useState<SubjectpageType>();
  const [loading, setLoading] = useState(false);
  const [savedToServer, setSavedToServer]= useState(false); //skal denne kommunisere med den som ligger i subjectpageform?

  const fetchSubject = async () => {
    if (subjectId) {
      setLoading(true);
      const subject = await taxonomyApi.fetchSubject(subjectId);
      const subjectpageId = subject.contentUri.split(':').pop() || '';
      try {
        const subjectpage = await frontpageApi.fetchSubjectpage(
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
            subjectpage.about.visualElement.type,
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

  //TODO: må bruke savedsubjectpage etter kommunikasjon med endepunkt er satt opp
  const updateSubjectpage = async(updatedSubjectpage : SubjectpageType) => {
    const savedSubjectpage = await frontpageApi.updateSubjectpage(transformSubjectToApiVersion(updatedSubjectpage));
    const externalIds = updatedSubjectpage.editorsChoices.map((x : ArticleType) => x.id); //savedSubjectpage.editorsChoices.map((x: string) => x.split(':').pop(),);
    const editorsChoices = await fetchEditorsChoices(externalIds);
    setSubjectpage(updatedSubjectpage);//transformSubjectFromApiVersion(savedSubjectpage, savedSubjectpage.about.visualElement.type, editorsChoices, subjectId));
    return updatedSubjectpage;
  }

  const createSubjectpage = async (createdSubjectpage : SubjectpageType) => {
    const savedSubjectpage = await frontpageApi.createSubjectpage(transformSubjectToApiVersion(createdSubjectpage));
    const externalIds = savedSubjectpage.editorsChoices.map((x: string) =>
        x.split(':').pop(),
    );
    const editorsChoices = await fetchEditorsChoices(savedSubjectpage.externalIds);
    //hvor skal den få subjectid fra?
    setSubjectpage(transformSubjectFromApiVersion(savedSubjectpage, savedSubjectpage.about.visualElement.type, editorsChoices, subjectId));
    return savedSubjectpage;
  }

  //ref articleformhooks
  const handleSubmit = async (formik: FormikProps<SubjectpageType>) => {
    formik.setSubmitting(true);
    try{
      await updateSubjectpage(formik.values)

      setSavedToServer(true);
      formik.resetForm();

      Object.keys(formik.values).map(fieldName =>
          formik.setFieldTouched(fieldName, true, true),
      );

    } catch(err) {
      if (err && err.status && err.status === 409) {
        //se topicArticlePage, der blir createmessage sendt ned til articleformhooks
        messageActions.addMessage({
          message: t('alertModal.needToRefresh'),
          timeToLive: 0,
        });
      } else if (err && err.json && err.json.messages) {
        messageActions.addMessage(formatErrorMessage(err));
      } else {
        messageActions.applicationError(err);
      }
      formik.setSubmitting(false);
      setSavedToServer(false);
    }
  }

  useEffect(() => {
    fetchSubject();
  }, [subjectId]);

  return {
    subjectpage,
    loading,
    fetchEditorsChoices,
    updateSubjectpage,
    createSubjectpage,
    handleSubmit,
    savedToServer,
  };
}
