/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { injectT } from '@ndla/i18n';
import React, { FC, useState } from 'react';
import { Form, Formik } from 'formik';
import {
  ContentResultType,
  NdlaFilmApiType,
  NdlaFilmThemesEditType,
  TranslateType,
} from '../../../interfaces';
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
  t: TranslateType;
  filmFrontpage: NdlaFilmApiType;
  updateFilmFrontpage: Function;
  selectedLanguage: string;
  allMovies: ContentResultType[];
  loading: boolean;
  slideshowMovies: ContentResultType[];
  themes: NdlaFilmThemesEditType;
}

const NdlaFilmForm: FC<Props> = ({
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
        const {
          values,
          dirty,
          isSubmitting,
          errors,
          setFieldTouched,
          isValid,
          setSubmitting,
        } = formik;
        const formIsDirty: boolean = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });
        setUnsaved(formIsDirty);
        setReinitializeEnabled(selectedLanguage !== values.language);
        const headerContent = {
          ...values,
          title: values.name,
          id: '20',
        };
        return (
          <Form {...formClasses()}>
            <SimpleLanguageHeader
              values={headerContent}
              editUrl={(lang: string) => toEditNdlaFilm(lang)}
              isSubmitting={isSubmitting}
            />
            <NdlaFilmAccordionPanels
              errors={errors}
              setFieldTouched={setFieldTouched}
              formIsDirty={formIsDirty}
              allMovies={allMovies}
              loading={loading}
              selectedLanguage={selectedLanguage}
              setSubmitting={setSubmitting}
              formik={formik}
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
