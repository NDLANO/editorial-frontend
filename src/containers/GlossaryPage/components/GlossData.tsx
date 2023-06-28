/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from 'formik';
import { FieldHeader, Input, Select } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
import FormikField from '../../../components/FormikField';
import TranscriptionsField from './TranscriptionsField';
import { ConceptFormValues } from '../../ConceptPage/conceptInterfaces';
import Examples from './Examples';
import { WordClasses } from '../glossaryData';

const GlossData = () => {
  const formikContext = useFormikContext<ConceptFormValues>();
  const { glossData } = formikContext.values;
  const { t } = useTranslation();

  if (!glossData) return <></>;
  return (
    <>
      <FormikField name="glossData.gloss">
        {({ field }) => (
          <Input
            label={t('form.concept.glossData.gloss')}
            name="glossData.gloss"
            type="text"
            value={glossData.gloss}
          />
        )}
      </FormikField>

      <FormikField name="glossData.wordClass">
        {({ field }) => (
          <Select
            label={t('form.concept.glossData.wordClass')}
            value={glossData.wordClass}
            {...field}
          >
            {Object.entries(WordClasses).map((entry) => (
              <option value={entry[0]} key={entry[0]}>
                {entry[1]}
              </option>
            ))}
          </Select>
        )}
      </FormikField>
      <FormikField name="glossData.originalLanguage">
        {({ field }) => (
          <Input
            label={t('form.concept.glossData.originalLanguage')}
            type="text"
            value={glossData.originalLanguage}
          />
        )}
      </FormikField>

      <FieldHeader title={t('form.concept.glossData.transcriptions')} />
      <FormikField name="glossData.transcriptions">
        {({ field }) => <TranscriptionsField values={glossData.transcriptions} {...field} />}
      </FormikField>

      <FieldHeader title={t('form.concept.glossData.examples')} />
      <FormikField name="glossData.examples">
        {({ field }) => <Examples label="examples" values={glossData.examples} {...field} />}
      </FormikField>
      {/*
   

      */}
    </>
  );
};

export default GlossData;
