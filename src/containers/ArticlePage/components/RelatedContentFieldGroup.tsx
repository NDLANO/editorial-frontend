/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { ApiConceptType } from '../../../modules/concept/conceptApiInterfaces';
import FormikField from '../../../components/FormikField';
import ConceptsField from './ConceptsField';
import ContentField from './ContentField';
import { RelatedContentType } from '../../../interfaces';

interface Props {
  values: {
    conceptIds: ApiConceptType[];
    relatedContent: RelatedContentType[];
  };
  locale: string;
}

const RelatedContentFieldGroup = ({ locale, values }: Props) => {
  return (
    <Fragment>
      <FormikField name={'conceptIds'}>
        {({ field, form }) => (
          <ConceptsField field={field} form={form} locale={locale} values={values} />
        )}
      </FormikField>
      <FormikField name={'relatedContent'}>
        {({ field, form }) => (
          <ContentField field={field} form={form} locale={locale} values={values} />
        )}
      </FormikField>
    </Fragment>
  );
};

export default RelatedContentFieldGroup;
