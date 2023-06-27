/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from 'formik';
import { FieldHeader, Input, Select } from '@ndla/forms';

import FormikField from '../../../components/FormikField';
import TranscriptionsField from './TranscriptionsField';
import { ConceptFormValues } from '../../ConceptPage/conceptInterfaces';
import Examples from './Examples';

const foo = ['test'];

const GlossData = () => {
  const formikContext = useFormikContext<ConceptFormValues>();
  const { values } = formikContext;
  return (
    <>
      <FormikField name="glossData.gloss">
        {({ field }) => <Input label="Gloss" name="glossData.gloss" type="text" value={'gloss'} />}
      </FormikField>

      <FormikField name="glossData.wordClass">
        {({ field }) => (
          <Select value={field.name} label="wordClass">
            {!values.license && <option>{'choose'}</option>}
            {foo.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </Select>
        )}
      </FormikField>

      <FormikField name="glossData.originalLanguage">
        {({ field }) => <Input label="originalLanguage" type="text" value={'Original language'} />}
      </FormikField>

      <FieldHeader title="transcription" />
      <FormikField name="glossData.transcriptions">
        {({ field }) => (
          <TranscriptionsField values={values.glossData!.transcriptions} {...field} />
        )}
      </FormikField>

      <FieldHeader title="Examples" />
      <FormikField name="glossData.examples">
        {({ field }) => (
          <Examples label="examples" values={values.glossData!.examples} {...field} />
        )}
      </FormikField>
    </>
  );
};

export default GlossData;
