/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import FormikField from '../../../components/FormikField';
import { DRAFT_ADMIN_SCOPE } from '../../../constants';
import ConceptsField from './ConceptsField';
import ContentField from './ContentField';
import { ArticleFormikType } from '../../FormikForm/articleFormHooks';
import { useSession } from '../../Session/SessionProvider';

interface Props {
  values: ArticleFormikType;
  locale: string;
}

const RelatedContentFieldGroup = ({ locale, values }: Props) => {
  const { userAccess } = useSession();
  return (
    <>
      <FormikField name={'conceptIds'}>
        {({ field, form }) => (
          <ConceptsField field={field} form={form} locale={locale} values={values} />
        )}
      </FormikField>
      {!!userAccess?.includes(DRAFT_ADMIN_SCOPE) && (
        <FormikField name={'relatedContent'}>
          {({ field, form }) => (
            <ContentField field={field} form={form} locale={locale} values={values} />
          )}
        </FormikField>
      )}
    </>
  );
};

export default RelatedContentFieldGroup;
