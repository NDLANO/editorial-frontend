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
import LanguageVariant from './LanguageVariant';
import FormAccordion from '../../../components/Accordion/FormAccordion';

interface Props {
  label: string;
  exampleLists: IGlossExample[][];
}

const Examples = ({ label, exampleLists }: Props) => {
  const { t } = useTranslation();

  const formikContext = useFormikContext<any>();
  const { errors } = formikContext;

  return (
    <FieldArray
      name={label}
      render={(arrayHelpers: any) => (
        <>
          {exampleLists.map((examples, index) => (
            <FieldSection key={`${label}.${index}`}>
              <FieldRemoveButton onClick={() => arrayHelpers.remove(index)} />
              <div>
                <FormAccordion
                  id={`${label}.accordion.${index}`}
                  title={`${t('form.concept.glossDataSection.example')} ${index + 1}`}
                  hasError={!!errors[`${label}.${index}`]}
                >
                  <LanguageVariant label={label} examples={examples} index={index} />
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

export default Examples;
