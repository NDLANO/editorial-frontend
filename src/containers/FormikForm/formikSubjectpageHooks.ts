/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { useEffect, useState } from 'react';
import {
  ISubjectPageData,
  IUpdatedSubjectFrontPageData,
  INewSubjectFrontPageData,
} from '@ndla/types-frontpage-api';
import { IImageMetaInformationV2 } from '@ndla/types-image-api';
import { ILearningPathV2 } from '@ndla/types-learningpath-api';
import { IArticle } from '@ndla/types-draft-api';
import * as frontpageApi from '../../modules/frontpage/frontpageApi';
import { getUrnFromId } from '../../util/subjectHelpers';
import { LocaleType } from '../../interfaces';
import { fetchDraft } from '../../modules/draft/draftApi';
import { fetchResource } from '../../modules/taxonomy/resources';
import { updateSubject } from '../../modules/taxonomy/subjects';
import { fetchTopic } from '../../modules/taxonomy/topics';
import { fetchLearningpath } from '../../modules/learningpath/learningpathApi';
import { Resource, Topic } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { fetchImage } from '../../modules/image/imageApi';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

export function useFetchSubjectpageData(
  elementId: string,
  selectedLanguage: LocaleType,
  subjectpageId: string | undefined,
) {
  const [subjectpage, setSubjectpage] = useState<ISubjectPageData>();
  const [editorsChoices, setEditorsChoices] = useState<(IArticle | ILearningPathV2)[]>([]);
  const [banner, setBanner] = useState<IImageMetaInformationV2 | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const { taxonomyVersion } = useTaxonomyVersion();

  const fetchElementList = async (taxonomyUrns: string[], taxonomyVersion: string) => {
    const taxonomyElements = await Promise.all<Topic | Resource>(
      taxonomyUrns.map(urn =>
        urn.split(':')[1] === 'topic'
          ? fetchTopic({ id: urn, taxonomyVersion })
          : fetchResource({ id: urn, taxonomyVersion }),
      ),
    );

    const elementIds = taxonomyElements
      .map(element => element.contentUri?.split(':') ?? [])
      .filter(uri => uri.length > 0 && Number([uri.length - 1]));

    const promises = elementIds.map(async elementId => {
      const f = elementId[1] === 'learningpath' ? fetchLearningpath : fetchDraft;
      return await f(parseInt(elementId.pop()!));
    });
    return await Promise.all(promises);
  };

  const updateSubjectpage = async (
    id: string | number,
    updatedSubjectpage: IUpdatedSubjectFrontPageData,
  ) => {
    const savedSubjectpage = await frontpageApi.updateSubjectpage(
      updatedSubjectpage,
      id,
      selectedLanguage,
    );
    setSubjectpage(savedSubjectpage);
    return savedSubjectpage;
  };

  const createSubjectpage = async (subjectPage: INewSubjectFrontPageData) => {
    const savedSubjectpage = await frontpageApi.createSubjectpage(subjectPage);
    await updateSubject({
      id: elementId,
      body: { name: savedSubjectpage.name, contentUri: getUrnFromId(savedSubjectpage.id) },
      taxonomyVersion,
    });
    setSubjectpage(savedSubjectpage);
    return savedSubjectpage;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (subjectpageId) {
        try {
          const subjectpage = await frontpageApi.fetchSubjectpage(subjectpageId, selectedLanguage);
          setSubjectpage(subjectpage);
        } catch (e) {
          setError(e);
          setLoading(false);
        }
      }
    })();
  }, [subjectpageId, selectedLanguage]);

  useEffect(() => {
    (async () => {
      if (subjectpage) {
        try {
          const editorsChoices = await fetchElementList(
            subjectpage.editorsChoices,
            taxonomyVersion,
          );
          const banner = await fetchImage(subjectpage.banner.desktopId, selectedLanguage);
          setEditorsChoices(editorsChoices);
          setBanner(banner);
        } catch (e) {
          setError(e);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [selectedLanguage, subjectpage, taxonomyVersion]);

  return {
    subjectpage,
    banner,
    editorsChoices,
    loading,
    updateSubjectpage,
    createSubjectpage,
    error,
  };
}
