/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { useEffect, useState } from 'react';
import * as frontpageApi from '../../modules/frontpage/frontpageApi';
import {
  transformSubjectpageFromApiVersion,
  transformSubjectpageToApiVersion,
  getUrnFromId,
} from '../../util/subjectHelpers';
import { SubjectpageApiType, SubjectpageEditType } from '../../interfaces';
import { fetchDraft } from '../../modules/draft/draftApi';
import { fetchSubjectFilter, updateSubjectFilter } from '../../modules/taxonomy/filter';
import {
  fetchResource,
  queryResources,
  queryTopics,
  queryLearningPathResource,
} from '../../modules/taxonomy/resources';
import { updateSubject } from '../../modules/taxonomy/subjects';
import { fetchTopic } from '../../modules/taxonomy/topics';
import { fetchLearningpath } from '../../modules/learningpath/learningpathApi';
import * as visualElementApi from '../VisualElement/visualElementApi';
import { imageToVisualElement } from '../../util/visualElementHelper';

export function useFetchSubjectpageData(
  elementId: string,
  selectedLanguage: string,
  subjectpageId: string | undefined,
) {
  const [subjectpage, setSubjectpage] = useState<SubjectpageEditType>();
  const [subjectId, setSubjectId] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const fetchSubjectId = async (elementId: string, selectedLanguage: string) => {
    if (elementId.includes('filter')) {
      const filter = await fetchSubjectFilter(elementId, selectedLanguage);
      setSubjectId(filter.subjectId);
    }
  };

  const fetchElementList = async (taxonomyUrns: string[]) => {
    const taxonomyElements = await Promise.all(
      taxonomyUrns.map(urn => {
        if (urn.split(':')[1] === 'topic') {
          return fetchTopic(urn);
        }
        return fetchResource(urn);
      }),
    );
    const elementIds = taxonomyElements.map(element => element.contentUri.split(':'));
    return Promise.all(
      elementIds.map(async elementId => {
        if (elementId[1] === 'learningpath') {
          const learningpath = await fetchLearningpath(elementId.pop());
          return {
            ...learningpath,
            metaImage: {
              url: learningpath.coverPhoto.url,
            },
          };
        }
        return fetchDraft(elementId.pop());
      }),
    );
  };

  const fetchTaxonomyUrns = async (elementList: any[], language: string): Promise<string[]> => {
    const fetched = await Promise.all(
      elementList.map(element => {
        if (element.articleType === 'topic-article') {
          return queryTopics(element.id, language);
        } else if (element.learningsteps) {
          return queryLearningPathResource(element.id);
        }
        return queryResources(element.id, language);
      }),
    );

    return fetched.map(resource => resource?.[0]?.id).filter(e => e !== undefined);
  };

  const updateSubjectpage = async (updatedSubjectpage: SubjectpageEditType) => {
    const editorsChoices = await fetchTaxonomyUrns(
      updatedSubjectpage.editorsChoices!,
      updatedSubjectpage.language,
    );
    const savedSubjectpage = await frontpageApi.updateSubjectpage(
      transformSubjectpageToApiVersion(updatedSubjectpage, editorsChoices),
      updatedSubjectpage.id,
      selectedLanguage,
    );
    setSubjectpage(
      transformSubjectpageFromApiVersion(
        savedSubjectpage,
        elementId,
        selectedLanguage,
        updatedSubjectpage.editorsChoices!,
        updatedSubjectpage.desktopBanner!,
      ),
    );
    return savedSubjectpage;
  };

  const createSubjectpage = async (createdSubjectpage: SubjectpageEditType) => {
    const editorsChoices = await fetchTaxonomyUrns(
      createdSubjectpage.editorsChoices!,
      createdSubjectpage.language,
    );

    const savedSubjectpage = await frontpageApi.createSubjectpage(
      transformSubjectpageToApiVersion(createdSubjectpage, editorsChoices),
    );
    if (subjectId) {
      // filter
      await updateSubjectFilter(
        elementId,
        savedSubjectpage.name,
        getUrnFromId(savedSubjectpage.id),
        subjectId,
      );
    } else {
      await updateSubject(elementId, savedSubjectpage.name, getUrnFromId(savedSubjectpage.id));
    }
    setSubjectpage(
      transformSubjectpageFromApiVersion(
        savedSubjectpage,
        elementId,
        selectedLanguage,
        createdSubjectpage.editorsChoices!,
        createdSubjectpage.desktopBanner!,
      ),
    );
    return savedSubjectpage;
  };

  useEffect(() => {
    const fetchSubjectpage = async () => {
      if (subjectpageId) {
        setLoading(true);
        try {
          const subjectpage: SubjectpageApiType = await frontpageApi.fetchSubjectpage(
            subjectpageId,
            selectedLanguage,
          );
          const editorsChoices = await fetchElementList(subjectpage.editorsChoices);
          const banner = await visualElementApi.fetchImage(
            subjectpage.banner.desktopId,
            selectedLanguage,
          );
          setSubjectpage(
            transformSubjectpageFromApiVersion(
              subjectpage,
              elementId,
              selectedLanguage,
              // @ts-ignore TODO Mismatching Article types, should be fixed when ConceptForm.jsx -> tsx
              editorsChoices,
              imageToVisualElement(banner),
            ),
          );
        } catch (err) {
          setError(err);
        }
        setLoading(false);
      }
    };
    fetchSubjectpage();
    fetchSubjectId(elementId, selectedLanguage);
  }, [elementId, selectedLanguage, subjectpageId]);

  return {
    subjectpage,
    loading,
    updateSubjectpage,
    createSubjectpage,
    error,
  };
}
