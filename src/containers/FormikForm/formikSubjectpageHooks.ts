/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { useEffect, useState } from 'react';
import * as frontpageApi from '../../modules/frontpage/frontpageApi';
import {
  transformSubjectFromApiVersion,
  transformSubjectToApiVersion,
  getUrnFromId,
} from '../../util/subjectHelpers';
import {
  Image,
  SubjectpageApiType,
  SubjectpageEditType,
} from '../../interfaces';
import { updateSubjectContentUri } from '../../modules/taxonomy/subjects';
import { fetchDraft } from '../../modules/draft/draftApi';
import {
  fetchResource,
  queryResources,
  queryTopics,
  queryLearningPathResource,
} from '../../modules/taxonomy/resources';
import { fetchTopic } from '../../modules/taxonomy/topics';
import { fetchLearningpath } from '../../modules/learningpath/learningpathApi';
import * as visualElementApi from '../VisualElement/visualElementApi';
import { convertFieldWithFallback } from '../../util/convertFieldWithFallback';

export function useFetchSubjectpageData(
  subjectId: string,
  selectedLanguage: string,
  subjectpageId: string | undefined,
) {
  const [subjectpage, setSubjectpage] = useState<SubjectpageEditType>();
  const [loading, setLoading] = useState(false);

  const fetchSubjectpage = async () => {
    if (subjectpageId) {
      setLoading(true);
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
        transformSubjectFromApiVersion(
          subjectpage,
          subjectId,
          selectedLanguage,
          editorsChoices,
          imageToVisualElement(banner),
        ),
      );
      setLoading(false);
    }
  };

  const imageToVisualElement = (image: Image) => {
    return {
      resource: 'image',
      resource_id: image.id,
      size: image.size,
      align: '',
      alt: convertFieldWithFallback(image, 'alttext', ''),
      caption: convertFieldWithFallback(image, 'caption', ''),
      url: image.metaUrl,
      metaData: image,
    };
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
    const elementIds = taxonomyElements.map(element =>
      element.contentUri.split(':'),
    );
    return await Promise.all(
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

  const fetchTaxonomyUrns = async (elementList: any[], language: string) => {
    return await Promise.all(
      elementList.map(element => {
        if (element.articleType === 'topic-article') {
          return queryTopics(element.id, language);
        } else if (element.learningsteps) {
          return queryLearningPathResource(element.id);
        }
        return queryResources(element.id, language);
      }),
    );
  };

  const updateSubjectpage = async (updatedSubjectpage: SubjectpageEditType) => {
    const editorsChoices = await fetchTaxonomyUrns(
      updatedSubjectpage.editorsChoices,
      updatedSubjectpage.language,
    );
    const savedSubjectpage = await frontpageApi.updateSubjectpage(
      transformSubjectToApiVersion(
        updatedSubjectpage,
        editorsChoices.map(resource => resource[0].id),
      ),
      updatedSubjectpage.id,
      selectedLanguage,
    );
    setSubjectpage(
      transformSubjectFromApiVersion(
        savedSubjectpage,
        subjectId,
        selectedLanguage,
        updatedSubjectpage.editorsChoices,
        updatedSubjectpage.desktopBanner,
      ),
    );
    return savedSubjectpage;
  };

  const createSubjectpage = async (createdSubjectpage: SubjectpageEditType) => {
    const editorsChoices = await fetchTaxonomyUrns(
      createdSubjectpage.editorsChoices,
      createdSubjectpage.language,
    );
    const savedSubjectpage = await frontpageApi.createSubjectpage(
      transformSubjectToApiVersion(createdSubjectpage, editorsChoices),
    );
    await updateSubjectContentUri(
      subjectId,
      savedSubjectpage.name,
      getUrnFromId(savedSubjectpage.id),
    );
    setSubjectpage(
      transformSubjectFromApiVersion(
        savedSubjectpage,
        subjectId,
        selectedLanguage,
        createdSubjectpage.editorsChoices,
        createdSubjectpage.desktopBanner,
      ),
    );
    return savedSubjectpage;
  };

  useEffect(() => {
    fetchSubjectpage();
  }, [subjectId, selectedLanguage]);

  return {
    subjectpage,
    loading,
    updateSubjectpage,
    createSubjectpage,
  };
}
