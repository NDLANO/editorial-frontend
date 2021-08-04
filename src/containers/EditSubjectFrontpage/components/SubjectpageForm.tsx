/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import { Descendant } from 'slate';
import { injectT, tType } from '@ndla/i18n';
import { Formik, Form, FormikProps } from 'formik';
import { SubjectpageEditType, SubjectpageType, Embed, ArticleType } from '../../../interfaces';
import Field from '../../../components/Field';
import SimpleLanguageHeader from '../../../components/HeaderWithLanguage/SimpleLanguageHeader';
import { AlertModalWrapper, formClasses } from '../../FormikForm';
import validateFormik from '../../../components/formikValidationSchema';
import { isFormikFormDirty, subjectpageRules } from '../../../util/formHelper';
import { toEditSubjectpage } from '../../../util/routeHelpers';
import usePreventWindowUnload from '../../FormikForm/preventWindowUnloadHook';
import SubjectpageAccordionPanels from './SubjectpageAccordionPanels';
import { useSubjectpageFormHooks } from '../../FormikForm/subjectpageFormHooks';
import {
  editorValueToPlainText,
  plainTextToEditorValue,
  embedToEditorValue,
  editorValueToEmbed,
} from '../../../util/articleContentConverter';
import SaveButton from '../../../components/SaveButton';

interface Props {
  subjectpage: SubjectpageEditType;
  updateSubjectpage: Function;
  selectedLanguage: string;
  elementId: string;
  isNewlyCreated: boolean;
}
export interface SubjectFormValues
  extends Omit<SubjectpageType, 'description' | 'metaDescription'> {
  visualElement: Descendant[];
  articleType: string;
  description?: Descendant[];
  metaDescription?: Descendant[];
  desktopBanner?: Embed;
  editorsChoices: ArticleType[];
  language: string;
  mobileBanner?: number;
  elementId?: string;
  title: string;
}

const getInitialValues = (
  subjectpage: SubjectpageEditType,
  elementId: string,
  selectedLanguage: string,
): SubjectFormValues => {
  return {
    articleType: elementId.includes('subject') ? 'subjectpage' : 'filter',
    supportedLanguages: subjectpage.supportedLanguages || [],
    language: selectedLanguage,
    description: plainTextToEditorValue(subjectpage.description || ''),
    title: subjectpage.title || '',
    mobileBanner: subjectpage.mobileBanner || undefined,
    desktopBanner: subjectpage.desktopBanner || undefined,
    visualElement: embedToEditorValue(subjectpage.visualElement),
    editorsChoices: subjectpage.editorsChoices || [],
    facebook: subjectpage.facebook || '',
    filters: subjectpage.filters || [],
    goTo: subjectpage.goTo || [],
    id: subjectpage.id,
    latestContent: subjectpage.latestContent || [],
    layout: subjectpage.layout || 'single',
    metaDescription: plainTextToEditorValue(subjectpage.metaDescription || ''),
    mostRead: subjectpage.mostRead || [],
    name: subjectpage.name || '',
    topical: subjectpage.topical || '',
    twitter: subjectpage.twitter || '',
    elementId: elementId,
  };
};

const getSubjectpageFromSlate = (values: SubjectFormValues) => {
  return {
    articleType: 'subjectpage',
    supportedLanguages: values.supportedLanguages,
    description: values.description ? editorValueToPlainText(values.description) : '',
    title: values.title,
    visualElement: editorValueToEmbed(values.visualElement),
    language: values.language,
    mobileBanner: values.mobileBanner,
    desktopBanner: values.desktopBanner,
    editorsChoices: values.editorsChoices,
    facebook: values.facebook,
    filters: values.filters,
    goTo: values.goTo,
    id: values.id,
    latestContent: values.latestContent,
    layout: values.layout,
    metaDescription: values.metaDescription ? editorValueToPlainText(values.metaDescription) : '',
    mostRead: values.mostRead,
    name: values.name,
    topical: values.topical,
    twitter: values.twitter,
  };
};

const SubjectpageForm = ({
  t,
  elementId,
  subjectpage,
  selectedLanguage,
  updateSubjectpage,
  isNewlyCreated,
}: Props & tType) => {
  const { savedToServer, handleSubmit, initialValues } = useSubjectpageFormHooks(
    getSubjectpageFromSlate,
    updateSubjectpage,
    t,
    subjectpage,
    getInitialValues,
    selectedLanguage,
    elementId,
  );
  const [unsaved, setUnsaved] = useState(false);
  usePreventWindowUnload(unsaved);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}}
      validate={values => validateFormik(getSubjectpageFromSlate(values), subjectpageRules, t)}>
      {(formik: FormikProps<SubjectFormValues>) => {
        const { values, dirty, isSubmitting, errors, isValid, handleBlur } = formik;

        const formIsDirty: boolean = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });
        setUnsaved(formIsDirty);
        return (
          <Form {...formClasses()}>
            <SimpleLanguageHeader
              articleType={values.articleType!}
              editUrl={(lang: string) => toEditSubjectpage(values.elementId!, lang, values.id)}
              id={parseInt(values.id!)}
              isSubmitting={isSubmitting}
              language={values.language}
              supportedLanguages={values.supportedLanguages!}
              title={values.name}
            />
            <SubjectpageAccordionPanels
              editorsChoices={values.editorsChoices!}
              elementId={values.elementId!}
              errors={errors}
              handleSubmit={() => handleSubmit(formik)}
              onBlur={(event, editor) => {
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
                showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
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

export default injectT(SubjectpageForm);
