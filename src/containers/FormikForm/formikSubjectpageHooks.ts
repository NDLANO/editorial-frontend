import { useEffect, useState } from 'react';
import * as frontpageApi from '../../modules/frontpage/frontpageApi';
import handleError from '../../util/handleError';
import {
  transformSubjectFromApiVersion,
  transformSubjectToApiVersion,
  getUrnFromId,
} from '../../util/subjectHelpers';
import { SubjectpageApiType, SubjectpageEditType } from '../../interfaces';
import { updateSubjectContentUri } from '../../modules/taxonomy/subjects';

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
      try {
        const subjectpage: SubjectpageApiType = await frontpageApi.fetchSubjectpage(
          subjectpageId,
          selectedLanguage,
        );
        setSubjectpage(
          transformSubjectFromApiVersion(
            subjectpage,
            subjectId,
            selectedLanguage,
          ),
        );
        setLoading(false);
      } catch (e) {
        handleError(e);
      }
    }
  };

  const updateSubjectpage = async (updatedSubjectpage: SubjectpageEditType) => {
    const savedSubjectpage = await frontpageApi.updateSubjectpage(
      transformSubjectToApiVersion(updatedSubjectpage),
      updatedSubjectpage.id,
    );
    setSubjectpage(
      transformSubjectFromApiVersion(
        savedSubjectpage,
        subjectId,
        selectedLanguage,
      ),
    );
    return savedSubjectpage;
  };

  const createSubjectpage = async (createdSubjectpage: SubjectpageEditType) => {
    const savedSubjectpage = await frontpageApi.createSubjectpage(
      transformSubjectToApiVersion(createdSubjectpage),
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
