import React, { FC, useState } from 'react';
import { FieldHeader } from '@ndla/forms';
import { FieldProps } from 'formik';
import { injectT } from '@ndla/i18n';
import VisualElementSelectField from '../VisualElement/VisualElementSelectField';
import VisualElementMenu from '../VisualElement/VisualElementMenu';
import VisualElement from '../VisualElement/VisualElement';
import FormikField from '../../components/FormikField';
import { TranslateType } from '../../interfaces';

interface Props {
  t: TranslateType;
  visualElementCaption: string;
  visualElementAlt: string;
  language: string;
}

const FormikVisualElement: FC<Props> = ({
  t,
  visualElementCaption,
  visualElementAlt,
  language,
}) => {
  const [selectedResource, setSelectedResource] = useState(undefined);
  return (
    <FormikField name="visualElement">
      {({ field }: FieldProps) => (
        <div>
          <FieldHeader title={t('form.visualElement.title')} />
          {!field.value.resource && (
            <VisualElementMenu onSelect={setSelectedResource} />
          )}
          <>
            <VisualElement
              label={t('form.visualElement.label')}
              changeVisualElement={setSelectedResource}
              resetSelectedResource={() => setSelectedResource(undefined)}
              {...field}
              value={{
                ...field.value,
                caption: visualElementCaption || field.value.caption,
                alt: visualElementAlt || field.value.alt,
              }}
              language={language}
            />
            <VisualElementSelectField
              selectedResource={selectedResource}
              resetSelectedResource={() => setSelectedResource(undefined)}
              {...field}
            />
          </>
        </div>
      )}
    </FormikField>
  );
};

export default injectT(FormikVisualElement);
