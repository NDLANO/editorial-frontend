/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IGlossExample } from '@ndla/types-backend/build/concept-api';
import { FieldRemoveButton, FieldSection } from '@ndla/forms';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { FieldArray, useFormikContext } from 'formik';
import LanguageVariantFieldArray from './LanguageVariantFieldArray';
import FormAccordion from '../../../components/Accordion/FormAccordion';

interface Props {
  name: string;
  examplesLists: IGlossExample[][];
}

const ExamplesFieldArray = ({ name, examplesLists }: Props) => {
  const { t } = useTranslation();

  const formikContext = useFormikContext<any>();
  const { errors } = formikContext;

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers: any) => (
        <>
          {examplesLists.map((examples, index) => (
            <FieldSection key={`${name}.${index}`}>
              <FieldRemoveButton onClick={() => arrayHelpers.remove(index)} />
              <div>
                <FormAccordion
                  id={`${name}.accordion.${index}`}
                  title={`${t('form.concept.glossDataSection.example')} ${index + 1}`}
                  hasError={!!errors[`${name}.${index}`]}
                >
                  <LanguageVariantFieldArray name={`${name}.${index}`} examples={examples} />
                </FormAccordion>
              </div>
            </FieldSection>
          ))}
          <ButtonV2
            variant="outline"
            onClick={() => arrayHelpers.push([{ example: '', language: '', transcriptions: {} }])}
            data-cy="addExample"
          >
            {t('form.concept.glossDataSection.add', {
              label: t(`form.concept.glossDataSection.example`).toLowerCase(),
            })}
          </ButtonV2>
        </>
      )}
    />
  );
};

export default ExamplesFieldArray;
