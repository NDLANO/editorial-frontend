/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useField, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { IMultiSearchSummary } from '@ndla/types-backend/search-api';
import DropdownSearch from '../../NdlaFilm/components/DropdownSearch';
import { getUrnFromId } from '../../../util/ndlaFilmHelpers';

interface Props {
  fieldName: string;
  onUpdateArticle: Function;
}

const NdlaFilmArticle = ({ fieldName, onUpdateArticle }: Props) => {
  const { t } = useTranslation();
  const form = useFormikContext();
  const [field] = useField<string>(fieldName);
  const selectedArticle = field.value;

  console.log(field);

  return (
    <>
      <DropdownSearch
        contextTypes="article"
        selectedElements={[]}
        onChange={(article: IMultiSearchSummary) => {
          console.log(article);
          onUpdateArticle(field, form, getUrnFromId(article.id));
        }}
        placeholder={'søk da, for faen'}
      />
    </>
  );
};

export default NdlaFilmArticle;
