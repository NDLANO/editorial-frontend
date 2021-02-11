/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { injectT, tType } from '@ndla/i18n';
import React, { FC, useState } from 'react';
import { Form, Formik } from 'formik';
import { ContentResultType, NdlaFilmApiType, NdlaFilmThemesEditType } from '../../../interfaces';
import { useNdlaFilmFormHooks } from '../../FormikForm/ndlaFilmFormHooks';
import usePreventWindowUnload from '../../FormikForm/preventWindowUnloadHook';
import Field from '../../../components/Field';
import { isFormikFormDirty, ndlaFilmRules } from '../../../util/formHelper';
import validateFormik from '../../../components/formikValidationSchema';
import { FormikAlertModalWrapper, formClasses } from '../../FormikForm/index';
import SimpleLanguageHeader from '../../../components/HeaderWithLanguage/SimpleLanguageHeader';
import { toEditNdlaFilm } from '../../../util/routeHelpers';
import NdlaFilmAccordionPanels from './NdlaFilmAccordionPanels';
import SaveButton from '../../../components/SaveButton';

interface Props {
  filmFrontpage: NdlaFilmApiType;
  updateFilmFrontpage: Function;
  selectedLanguage: string;
  allMovies: ContentResultType[];
  loading: boolean;
  slideshowMovies: ContentResultType[];
  themes: NdlaFilmThemesEditType;
}

const NdlaFilmForm: FC<Props & tType> = ({
  t,
  filmFrontpage,
  updateFilmFrontpage,
  selectedLanguage,
  loading,
  allMovies,
  slideshowMovies,
  themes,
}) => {
  const { savedToServer, handleSubmit, initialValues } = useNdlaFilmFormHooks(
    t,
    filmFrontpage,
    updateFilmFrontpage,
    slideshowMovies,
    themes,
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
        const { values, dirty, isSubmitting, errors, isValid, handleBlur } = formik;
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
              allMovies={allMovies}
              loading={loading}
              selectedLanguage={selectedLanguage}
              handleSubmit={() => handleSubmit(formik)}
              onBlur={(event, editor, next) => {
                next();
                // this is a hack since formik onBlur-handler interferes with slates
                // related to: https://github.com/ianstormtaylor/slate/issues/2434
                // formik handleBlur needs to be called for validation to work (and touched to be set)
                setTimeout(() => handleBlur({ target: { name: 'introduction' } }), 0);
              }}
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
            <FormikAlertModalWrapper
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

export default injectT(NdlaFilmForm);
