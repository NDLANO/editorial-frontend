/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IGlossExample } from '@ndla/types-backend/build/concept-api';
import { FieldRemoveButton } from '@ndla/forms';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot } from '@ndla/accordion';
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

  const handleExampleListChange = (
    example_list_index: number,
    newLanguageVariants: IGlossExample[],
  ) => {
    const newExampleLists = exampleLists;
    newExampleLists[example_list_index] = newLanguageVariants;
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
              <div key={`example_list_${index}`}>
                <FormAccordion
                  id={`example_list_${index}`}
                  title={`${t('form.concept.glossDataSection.example')} ${index + 1}`}
                  hasError={errors && !!errors[`example_${index}`]}
                >
                  <LanguageVariant
                    examples={examples}
                    index={index}
                    arrayHelpers={arrayHelpers}
                    handleExampleListChange={handleExampleListChange}
                    errorMessage={errors[`example_${index}`]}
                  />
                </FormAccordion>

                <FieldRemoveButton onClick={() => removeExampleList(index)}>
                  Fjern eksempel
                </FieldRemoveButton>
              </div>
            ))}
          </>
        )}
      />
      <ButtonV2 variant="outline" onClick={addExampleList} data-cy="addExample">
        {t('form.concept.glossDataSection.add', {
          label: t(`form.concept.glossDataSection.examples`),
        })}
      </ButtonV2>
    </>
  );
};

export default Examples;
