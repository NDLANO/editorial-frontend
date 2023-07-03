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

interface Props {
  label: string;
  onChange: (event: { target: { value: IGlossExample[][]; name: string } }) => void;
  errorMessages?: string[];
  showError?: boolean;
  disabled?: boolean;
  values: IGlossExample[][];
  name: string;
}

const Examples = ({ onChange, values: exampleLists, name }: Props) => {
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
                <AccordionRoot collapsible type="single">
                  <AccordionItem value="1">
                    <AccordionHeader>{`Example ${index + 1}`} </AccordionHeader>
                    <AccordionContent>
                      <LanguageVariant
                        examples={examples}
                        index={index}
                        arrayHelpers={arrayHelpers}
                        handleExampleListChange={handleExampleListChange}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </AccordionRoot>
                <FieldRemoveButton onClick={() => removeExampleList(index)}>
                  Fjern eksempel
                </FieldRemoveButton>
              </div>
            ))}
          </>
        )}
      />
      <ButtonV2 variant="outline" onClick={addExampleList} data-cy="addExample">
        {t('form.concept.glossData.add', {
          type: t(`form.concept.glossData.examples`),
        })}
      </ButtonV2>
    </>
  );
};

export default Examples;
