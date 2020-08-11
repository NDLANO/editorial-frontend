/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { Formik, Form, FormikProps } from 'formik';
import { SubjectpageEditType, TranslateType } from '../../../interfaces';
import Field from '../../../components/Field';
import SimpleLanguageHeader from '../../../components/HeaderWithLanguage/SimpleLanguageHeader';
import { FormikAlertModalWrapper, formClasses } from '../../FormikForm';
import validateFormik from '../../../components/formikValidationSchema';
import { isFormikFormDirty, subjectpageRules } from '../../../util/formHelper';
import { toEditSubjectpage } from '../../../util/routeHelpers';
import usePreventWindowUnload from '../../FormikForm/preventWindowUnloadHook';
import SubjectpageAccordionPanels from './SubjectpageAccordionPanels';
import { useSubjectpageFormHooks } from '../../FormikForm/subjectpageFormHooks';
import {
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../util/articleContentConverter';
import SaveButton from '../../../components/SaveButton';

interface Props {
  t: TranslateType;
  subjectpage: SubjectpageEditType;
  updateSubjectpage: Function;
  selectedLanguage: string;
  subjectId: number;
  isNewlyCreated: boolean;
}

const getInitialValues = (
  subjectpage: SubjectpageEditType,
  subjectId: number,
  selectedLanguage: string,
) => {
  return {
    articleType: 'subjectpage',
    supportedLanguages: subjectpage.supportedLanguages || [],
    language: selectedLanguage,
    description: plainTextToEditorValue(subjectpage.description, true),
    title: subjectpage.title || '',
    mobileBanner: subjectpage.mobileBanner || undefined,
    desktopBanner: subjectpage.desktopBanner || undefined,
    visualElement: subjectpage.visualElement || {
      resource: '',
      url: '',
      resource_id: '',
    },
    visualElementAlt: subjectpage.visualElementAlt || '',
    editorsChoices: subjectpage.editorsChoices || [],
    facebook: subjectpage.facebook || '',
    filters: subjectpage.filters || [],
    goTo: subjectpage.goTo || [],
    id: subjectpage.id,
    latestContent: subjectpage.latestContent || [],
    layout: subjectpage.layout || 'single',
    metaDescription: plainTextToEditorValue(subjectpage.metaDescription, true),
    mostRead: subjectpage.mostRead || [],
    name: subjectpage.name || '',
    topical: subjectpage.topical || '',
    twitter: subjectpage.twitter || '',
    subjectId: subjectId,
  };
};

const getSubjectpageFromSlate = (values: SubjectpageEditType) => {
  return {
    articleType: 'subjectpage',
    supportedLanguages: values.supportedLanguages,
    description: editorValueToPlainText(values.description),
    title: values.title,
    visualElement: {
      resource: values.visualElement.resource,
      url: values.visualElement.url,
      resource_id: values.visualElement.resource_id,
    },
    language: values.language,
    visualElementAlt: values.visualElementAlt,
    mobileBanner: values.mobileBanner,
    desktopBanner: values.desktopBanner,
    editorsChoices: values.editorsChoices,
    facebook: values.facebook,
    filters: values.filters,
    goTo: values.goTo,
    id: values.id,
    latestContent: values.latestContent,
    layout: values.layout,
    metaDescription: editorValueToPlainText(values.metaDescription),
    mostRead: values.mostRead,
    name: values.name,
    topical: values.topical,
    twitter: values.twitter,
  };
};

const SubjectpageForm: FC<Props> = ({
  t,
  subjectId,
  subjectpage,
  selectedLanguage,
  updateSubjectpage,
  isNewlyCreated,
}) => {
  const {
    savedToServer,
    handleSubmit,
    initialValues,
  } = useSubjectpageFormHooks(
    getSubjectpageFromSlate,
    updateSubjectpage,
    t,
    subjectpage,
    getInitialValues,
    selectedLanguage,
    subjectId,
  );
  const [unsaved, setUnsaved] = useState(false);
  usePreventWindowUnload(unsaved);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}}
      validate={values => validateFormik(values, subjectpageRules, t)}>
      {(formik: FormikProps<SubjectpageEditType>) => {
        const {
          values,
          dirty,
          isSubmitting,
          errors,
          touched,
          setFieldTouched,
          isValid,
        } = formik;

        const formIsDirty: boolean = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });
        setUnsaved(formIsDirty);
        const headerContent = {
          ...values,
          title: values.name,
        };
        return (
          <Form {...formClasses()}>
            <SimpleLanguageHeader
              values={headerContent}
              editUrl={(lang: string) =>
                toEditSubjectpage(values.subjectId, lang, values.id)
              }
              isSubmitting={isSubmitting}
            />
            <SubjectpageAccordionPanels
              values={values}
              errors={errors}
              subject={subjectpage}
              touched={touched}
              setFieldTouched={setFieldTouched}
              formIsDirty={formIsDirty}
              getInitialValues={getInitialValues}
            />
            <Field right>
              <SaveButton
                large
                isSaving={isSubmitting}
                showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
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

export default injectT(SubjectpageForm);
