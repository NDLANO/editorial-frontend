/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from 'formik';
import FormikField from '../../../components/FormikField';
import Transcriptions from './Transcriptions';
import { ConceptFormValues } from '../../ConceptPage/conceptInterfaces';

const GlossData = () => {
  const formikContext = useFormikContext<ConceptFormValues>();
  const { values } = formikContext;
  return (
    <>
      {/*
      <FormikField name="glossData.gloss" />
      <FormikField name="glossData.wordClass" />
      <FormikField name="glossData.originalLanguage" />
      <FormikField name="glossData.examples" />
        */}
      <FormikField name="glossData.transcriptions">
        {({ field }) => <Transcriptions values={values.glossData!.transcriptions} {...field} />}
      </FormikField>
    </>
  );
};

export default GlossData;
