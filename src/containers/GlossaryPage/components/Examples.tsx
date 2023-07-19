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
import { FieldArray } from 'formik';
import LanguageVariant from './LanguageVariant';
import FormAccordion from '../../../components/Accordion/FormAccordion';

interface Props {
  label: string;
  onChange: (event: { target: { value: IGlossExample[][]; name: string } }) => void;
  errorMessages?: string[];
  showError?: boolean;
  disabled?: boolean;
  values: IGlossExample[][];
  name: string;
  errors: any;
}

const Examples = ({ onChange, values: exampleLists, name, errors }: Props) => {
  const { t } = useTranslation();

  const addExampleList = () => {
    const newExampleLists = [...exampleLists];
    newExampleLists.push([{ example: '', language: '', transcriptions: {} }]);
    onExamplesChange(newExampleLists);
  };

  const removeExampleList = (index: number) => {
    const newExampleLists = exampleLists;
    newExampleLists.splice(index, 1);
    onExamplesChange(newExampleLists);
  };

  const onExamplesChange = (newExamples: IGlossExample[][]) => {
    onChange({
      target: {
        value: newExamples,
        name,
      },
    });
  };

  return (
    <>
      <FieldArray
        name="glossData.examples"
        render={(arrayHelpers: any) => (
          <>
            {exampleLists.map((examples, index) => (
              <FieldSection key={`example_list_${index}`}>
                <FieldRemoveButton onClick={() => removeExampleList(index)} />
                <div>
                  <FormAccordion
                    id={`example_list_${index}`}
                    title={`${t('form.concept.glossDataSection.example')} ${index + 1}`}
                    hasError={errors && !!errors[`example_${index}`]}
                  >
                    {errors && errors[`example_${index}`]}
                    <LanguageVariant
                      examples={examples}
                      index={index}
                      arrayHelpers={arrayHelpers}
                    />
                  </FormAccordion>
                </div>
              </FieldSection>
            ))}
          </>
        )}
      />
      <ButtonV2 variant="outline" onClick={addExampleList} data-cy="addExample">
        {t('form.concept.glossDataSection.add', {
          label: t(`form.concept.glossDataSection.example`).toLowerCase(),
        })}
      </ButtonV2>
    </>
  );
};

export default Examples;
