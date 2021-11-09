/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { Descendant } from 'slate';
import { useNdlaFilmFormHooks } from '../../FormikForm/ndlaFilmFormHooks';
import usePreventWindowUnload from '../../FormikForm/preventWindowUnloadHook';
import Field from '../../../components/Field';
import { isFormikFormDirty } from '../../../util/formHelper';
import validateFormik, { RulesType } from '../../../components/formikValidationSchema';
import { AlertModalWrapper, formClasses } from '../../FormikForm/index';
import SimpleLanguageHeader from '../../../components/HeaderWithLanguage/SimpleLanguageHeader';
import { toEditNdlaFilm } from '../../../util/routeHelpers';
import NdlaFilmAccordionPanels from './NdlaFilmAccordionPanels';
import SaveButton from '../../../components/SaveButton';
import {
  FilmFrontpageApiType,
  MovieThemeApiType,
} from '../../../modules/frontpage/frontpageApiInterfaces';

interface Props {
  filmFrontpage: FilmFrontpageApiType;
  selectedLanguage: string;
}

export interface FilmFormikType {
  articleType: string;
  name: string;
  title?: string;
  description: Descendant[];
  visualElement: Descendant[];
  language: string;
  supportedLanguages: string[];
  slideShow: string[];
  themes: MovieThemeApiType[];
}

const ndlaFilmRules: RulesType<FilmFormikType> = {
  title: {
    required: true,
  },
  description: {
    required: true,
    maxLength: 300,
  },
  visualElement: {
    required: true,
    // test: (values: FilmFormikType) => {
    //   const element = values?.visualElement[0];
    //   const data = Element.isElement(element) && element.type === TYPE_EMBED && element.data;
    //   const badVisualElementId = data && 'resource_id' in data && data.resource_id === '';
    //   return badVisualElementId
    //     ? { translationKey: 'subjectpageForm.missingVisualElement' }
    //     : undefined;
    // },
  },
};

const NdlaFilmForm = ({ filmFrontpage, selectedLanguage }: Props) => {
  const { t } = useTranslation();
  const { savedToServer, handleSubmit, initialValues } = useNdlaFilmFormHooks(
    filmFrontpage,
    selectedLanguage,
  );
  const [unsaved, setUnsaved] = useState(false);
  const [enableReinitialize, setReinitializeEnabled] = useState(false);
  usePreventWindowUnload(unsaved);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}}
      validate={values => validateFormik(values, ndlaFilmRules, t)}
      enableReinitialize={enableReinitialize}>
      {formik => {
        const { values, dirty, isSubmitting, errors, isValid } = formik;
        const formIsDirty: boolean = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });
        setUnsaved(formIsDirty);
        setReinitializeEnabled(selectedLanguage !== values.language);
        return (
          <Form {...formClasses()}>
            <SimpleLanguageHeader
              articleType={values.articleType!}
              editUrl={(lang: string) => toEditNdlaFilm(lang)}
              id={20}
              isSubmitting={isSubmitting}
              language={values.language}
              supportedLanguages={values.supportedLanguages!}
              title={values.name}
            />
            <NdlaFilmAccordionPanels
              errors={errors}
              formIsDirty={formIsDirty}
              selectedLanguage={selectedLanguage}
            />
            <Field right>
              <SaveButton
                large
                isSaving={isSubmitting}
                showSaved={!formIsDirty && savedToServer}
                formIsDirty={formIsDirty}
                onClick={() => handleSubmit(formik)}
                disabled={!isValid}
              />
            </Field>
            <AlertModalWrapper
              isSubmitting={isSubmitting}
              formIsDirty={formIsDirty}
              severity="danger"
              text={t('alertModal.notSaved')}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default NdlaFilmForm;
