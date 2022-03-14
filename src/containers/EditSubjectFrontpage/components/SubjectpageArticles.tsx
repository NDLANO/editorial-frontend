/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldHeader } from '@ndla/forms';
import { ILearningPathV2 } from '@ndla/types-learningpath-api';
import { IMultiSearchSummary } from '@ndla/types-search-api';
import { IArticle } from '@ndla/types-draft-api';
import { useField, useFormikContext } from 'formik';
import ElementList from '../../FormikForm/components/ElementList';
import DropdownSearch from '../../NdlaFilm/components/DropdownSearch';
import handleError from '../../../util/handleError';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { fetchLearningpath } from '../../../modules/learningpath/learningpathApi';

interface Props {
  editorsChoices: (IArticle | ILearningPathV2)[];
  elementId: string;
  fieldName: string;
}

const getSubject = (elementId: string) => {
  if (elementId.includes('subject')) {
    return elementId;
  }
  return undefined;
};

const SubjectpageArticles = ({ editorsChoices, elementId, fieldName }: Props) => {
  const { t } = useTranslation();
  const [resources, setResources] = useState<(IArticle | ILearningPathV2)[]>(editorsChoices);
  const { setFieldTouched } = useFormikContext();
  const [FieldInputProps] = useField<(IArticle | ILearningPathV2)[]>(fieldName);
  const { onChange } = FieldInputProps;
  const subjectId = getSubject(elementId);

  const onAddResultToList = async (result: IMultiSearchSummary) => {
    try {
      const f = result.learningResourceType === 'learningpath' ? fetchLearningpath : fetchDraft;
      const newResource = await f(result.id);
      const updatedResource = [...resources, { ...newResource, metaImage: result.metaImage }];
      setResources(updatedResource);
      updateFormik(updatedResource);
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (articleList: (IArticle | ILearningPathV2)[]) => {
    setResources(articleList);
    updateFormik(articleList);
  };

  const updateFormik = (newData: (IArticle | ILearningPathV2)[]) => {
    setFieldTouched(fieldName, true, false);
    onChange({
      target: {
        name: fieldName,
        value: newData || null,
      },
    });
  };

  return (
    <>
      <FieldHeader
        title={t('subjectpageForm.editorsChoices')}
        subTitle={t('subjectpageForm.articles')}
      />
      <ElementList
        elements={resources}
        data-cy="editors-choices-article-list"
        messages={{
          dragElement: t('form.file.changeOrder'),
          removeElement: t('subjectpageForm.removeArticle'),
        }}
        onUpdateElements={onUpdateElements}
      />
      <DropdownSearch
        selectedElements={resources}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={(result: IMultiSearchSummary) => onAddResultToList(result)}
        placeholder={t('subjectpageForm.addArticle')}
        subjectId={subjectId}
        clearInputField
      />
    </>
  );
};

export default SubjectpageArticles;
