/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useEffect, useState } from "react";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { ISubjectPageDTO, IUpdatedSubjectPageDTO, INewSubjectPageDTO } from "@ndla/types-backend/frontpage-api";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { Node } from "@ndla/types-taxonomy";
import { LocaleType } from "../../interfaces";
import { fetchDraft } from "../../modules/draft/draftApi";
import * as frontpageApi from "../../modules/frontpage/frontpageApi";
import { fetchLearningpath } from "../../modules/learningpath/learningpathApi";
import { fetchNode, putNode } from "../../modules/nodes/nodeApi";
import { getUrnFromId } from "../../util/subjectHelpers";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

export function useFetchSubjectpageData(
  elementId: string,
  selectedLanguage: LocaleType,
  subjectpageId: string | undefined,
) {
  const [subjectpage, setSubjectpage] = useState<ISubjectPageDTO>();
  const [editorsChoices, setEditorsChoices] = useState<(IArticleDTO | ILearningPathV2DTO)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const { taxonomyVersion } = useTaxonomyVersion();

  const fetchElementList = async (taxonomyUrns: string[], taxonomyVersion: string) => {
    const taxonomyElements = await Promise.all<Node>(
      taxonomyUrns.map((urn) => fetchNode({ id: urn, taxonomyVersion })),
    );

    const elementIds = taxonomyElements
      .map((element) => element.contentUri?.split(":") ?? [])
      .filter((uri) => uri.length > 0 && Number([uri.length - 1]));

    const promises = elementIds.map(async (elementId) => {
      const f = elementId[1] === "learningpath" ? fetchLearningpath : fetchDraft;
      return await f(parseInt(elementId.pop()!));
    });
    return await Promise.all(promises);
  };

  const updateSubjectpage = async (id: string | number, updatedSubjectpage: IUpdatedSubjectPageDTO) => {
    const savedSubjectpage = await frontpageApi.updateSubjectpage(updatedSubjectpage, id, selectedLanguage);
    setSubjectpage(savedSubjectpage);
    return savedSubjectpage;
  };

  const createSubjectpage = async (subjectPage: INewSubjectPageDTO) => {
    const savedSubjectpage = await frontpageApi.createSubjectpage(subjectPage);
    await putNode({
      id: elementId,
      name: savedSubjectpage.name,
      contentUri: getUrnFromId(savedSubjectpage.id),
      taxonomyVersion,
    });
    setSubjectpage(savedSubjectpage);
    return savedSubjectpage;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setSubjectpage(undefined);
      if (subjectpageId) {
        try {
          const subjectpage = await frontpageApi.fetchSubjectpage(subjectpageId, selectedLanguage);
          setSubjectpage(subjectpage);
        } catch (e) {
          setError(e as Error);
          setLoading(false);
        }
      }
    })();
  }, [subjectpageId, selectedLanguage]);

  useEffect(() => {
    (async () => {
      if (subjectpage) {
        try {
          const editorsChoices = await fetchElementList(subjectpage.editorsChoices, taxonomyVersion);
          setEditorsChoices(editorsChoices);
        } catch (e) {
          setError(e as Error);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [subjectpage, taxonomyVersion]);

  return {
    subjectpage,
    editorsChoices,
    loading,
    updateSubjectpage,
    createSubjectpage,
    error,
  };
}
