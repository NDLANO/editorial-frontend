/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import FormikField from '../../../components/FormikField';
import { DRAFT_ADMIN_SCOPE } from '../../../constants';
import ConceptsField from './ConceptsField';
import ContentField from './ContentField';
import { useSession } from '../../Session/SessionProvider';

const RelatedContentFieldGroup = () => {
  const { userPermissions } = useSession();
  return (
    <>
      <FormikField name={'conceptIds'}>
        {({ field, form }) => <ConceptsField field={field} form={form} />}
      </FormikField>
      {!!userPermissions?.includes(DRAFT_ADMIN_SCOPE) && (
        <FormikField name={'relatedContent'}>
          {({ field, form }) => <ContentField field={field} form={form} />}
        </FormikField>
      )}
    </>
  );
};

export default RelatedContentFieldGroup;
