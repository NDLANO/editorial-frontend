/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC } from 'react';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import ElementList from '../../NdlaFilm/components/ElementList';
import DropdownSearch from '../../NdlaFilm/components/DropdownSearch';
import {ArticleType, TranslateType} from '../../../interfaces';

interface Props {
  t: TranslateType;
  articles: ArticleType[];
}

const SubjectpageArticles: FC<Props> = ({ t, articles }) => {
  return (
    <>
      <FieldHeader
        title={t('subjectpageForm.editorsChoices')}
        subTitle={t('subjectpageForm.articles')}
      />
      <ElementList
    elements={articles}
    data-cy="editors-choices-article-list"
    messages={{
        dragElements: t('subjectpageForm.changeOrder'),
        removeElements: t('subjectpageForm.removeArticle'),
    }}
    onUpdateElements={() => {
        console.log('nå lagrer den');
    }}/>
      <DropdownSearch
        selectedElements={articles}
        onChange={console.log('prøver å legge til?')}
        placeholder={t('subjectpageForm.addArticle')}
        subjectId={1}
      />
    </>
  );
};

export default injectT(SubjectpageArticles);
