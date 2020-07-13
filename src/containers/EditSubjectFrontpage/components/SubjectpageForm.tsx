/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, useState } from 'react';
import { injectT } from '@ndla/i18n';
import {Formik, Form, FieldProps, FormikFormProps, FormikProps} from 'formik';
import { SubjectpageType, TranslateType } from '../../../interfaces';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage/HeaderWithLanguage';
import { FormikAlertModalWrapper, formClasses } from '../../FormikForm';
import validateFormik from '../../../components/formikValidationSchema';
import { isFormikFormDirty, subjectpageRules } from '../../../util/formHelper';
import { toEditSubjectpage } from '../../../util/routeHelpers';
import usePreventWindowUnload from '../../FormikForm/preventWindowUnloadHook';
import EditorFooter from '../../../components/SlateEditor/EditorFooter';
import { fetchStatusStateMachine } from '../../../modules/draft/draftApi';
import SubjectpageAccordionPanels from './SubjectpageAccordionPanels';
import {useSubjectpageFormHooks} from "../../FormikForm/formikSubjectpageHooks";

interface Props {
  t: TranslateType;
  subject: SubjectpageType;
  selectedLanguage: string;
  subjectId: number;
}

const getInitialValues = (
  subject: SubjectpageType,
  subjectId: number,
  selectedLanguage: string,
) => {
  const visualElementId = subject.about.visualElement.url.split('/').pop();
  return {
    articleType: 'subjectpage',
    supportedLanguages: ['nb', 'nn'], //??
    language: selectedLanguage,
    about: {
      visualElement: {
        resource: subject.about.visualElement.resource,
        url: subject.about.visualElement.url,
        alt: subject.about.visualElement.alt,
        caption: subject.about.visualElement.caption,
        resource_id: visualElementId,
      },
      description: subject.about.description,
      title: subject.about.title,
    },
    banner: {
      desktopId: subject.banner.desktopId,
      desktopUrl: subject.banner.desktopUrl,
      mobileUrl: subject.banner.mobileUrl,
      mobileId: subject.banner.mobileId,
    },
    editorsChoices: subject.editorsChoices,
    facebook: subject.facebook,
    filters: subject.filters,
    goTo: subject.goTo,
    id: subject.id,
    latestContent: subject.latestContent,
    layout: subject.layout,
    metaDescription: subject.metaDescription,
    mostRead: subject.mostRead,
    name: subject.name,
    topical: subject.topical,
    twitter: subject.twitter,
    subjectId: subjectId,
  };
};

const SubjectpageForm: FC<Props> = ({
  t,
  subjectId,
  subject,
  selectedLanguage,
}) => {
  const{
    savedToServer,
    handleSubmit,
  } = useSubjectpageFormHooks(subjectId, selectedLanguage, t);
  const [unsaved, setUnsaved] = useState(false);
  usePreventWindowUnload(unsaved);

  const initialValues = getInitialValues(subject, subjectId, selectedLanguage);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={() => {}}
      validate={values => validateFormik(values, subjectpageRules, t)}>
      {(formik: FormikProps<any>) => {
        const{
          values,
          dirty,
          isSubmitting,
          setValues,
          errors,
          touched,
          setFieldTouched
        } = formik;

        const formIsDirty: boolean = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });

        setUnsaved(formIsDirty);

        return (
          <Form {...formClasses()}>
            <HeaderWithLanguage
              content={initialValues}
              values={values}
              editUrl={(lang: string) =>
                toEditSubjectpage(values.subjectId, lang)
              }
              formIsDirty={formIsDirty}
              getInitialValues={getInitialValues}
              setValues={setValues}
              isSubmitting={isSubmitting}
              noStatus
            />
            <SubjectpageAccordionPanels
              values={values}
              errors={errors}
              subject={subject}
              touched={touched}
              setFieldTouched={setFieldTouched}
              formIsDirty={formIsDirty}
              getInitialValues={getInitialValues}
            />
            <EditorFooter
              showSimpleFooter
              isSubmitting={isSubmitting}
              formIsDirty={formIsDirty}
              savedToServer={savedToServer}
              getEntity={getInitialValues}
              values={values}
              onSaveClick={() => handleSubmit(formik)}
              getStateStatuses={fetchStatusStateMachine}
              isArticle
            />
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
