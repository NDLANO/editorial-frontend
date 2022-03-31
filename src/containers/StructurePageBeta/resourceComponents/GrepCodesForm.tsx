/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticle } from '@ndla/types-draft-api';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import SaveMultiButton from '../../../components/SaveMultiButton';
import GrepCodesField from '../../FormikForm/GrepCodesField';

interface Props {
  article: IArticle;
  onUpdate: (grepCodes: string[]) => Promise<void>;
}

interface Values {
  grepCodes: string[];
}

const GrepCodesForm = ({ article, onUpdate }: Props) => {
  const [saved, setSaved] = useState(false);
  const initialValues = { grepCodes: article.grepCodes };

  const handleSubmit = async (values: Values, helpers: FormikHelpers<Values>) => {
    await onUpdate(values.grepCodes);
    helpers.resetForm({ values: values });
    setSaved(true);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ dirty, errors, isSubmitting, submitForm }) => {
        if (saved && dirty) {
          setSaved(false);
        }
        return (
          <Form>
            <GrepCodesField />
            <SaveMultiButton
              isSaving={isSubmitting}
              formIsDirty={dirty}
              showSaved={saved && !dirty}
              onClick={submitForm}
              disabled={!!Object.keys(errors).length}
              hideSecondaryButton
            />
          </Form>
        );
      }}
    </Formik>
  );
};
export default GrepCodesForm;
