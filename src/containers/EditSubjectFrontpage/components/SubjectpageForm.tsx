/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { Element } from 'slate';
import {
  ISubjectPageData,
  INewSubjectFrontPageData,
  IUpdatedSubjectFrontPageData,
} from '@ndla/types-frontpage-api';
import Field from '../../../components/Field';
import SimpleLanguageHeader from '../../../components/HeaderWithLanguage/SimpleLanguageHeader';
import { AlertModalWrapper, formClasses } from '../../FormikForm';
import validateFormik, { RulesType } from '../../../components/formikValidationSchema';
import { isFormikFormDirty } from '../../../util/formHelper';
import { toEditSubjectpage } from '../../../util/routeHelpers';
import usePreventWindowUnload from '../../FormikForm/preventWindowUnloadHook';
import SubjectpageAccordionPanels from './SubjectpageAccordionPanels';
import SaveButton from '../../../components/SaveButton';
import { DraftApiType } from '../../../modules/draft/draftApiInterfaces';
import { Learningpath } from '../../../modules/learningpath/learningpathApiInterfaces';
import { ImageApiType } from '../../../modules/image/imageApiInterfaces';
import {
  subjectpageApiTypeToFormikType,
  SubjectPageFormikType,
  subjectpageFormikTypeToPatchType,
  subjectpageFormikTypeToPostType,
} from '../../../util/subjectHelpers';
import { useMessages } from '../../Messages/MessagesProvider';
import { formatErrorMessage } from '../../../util/apiHelpers';
import { queryLearningPathResource, queryResources, queryTopics } from '../../../modules/taxonomy';
import { Resource, Topic } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { TYPE_EMBED } from '../../../components/SlateEditor/plugins/embed';

interface Props {
  subjectpage?: ISubjectPageData;
  editorsChoices?: (DraftApiType | Learningpath)[];
  banner?: ImageApiType;
  createSubjectpage?: (subjectpage: INewSubjectFrontPageData) => Promise<ISubjectPageData>;
  updateSubjectpage?: (
    id: string | number,
    subjectpage: IUpdatedSubjectFrontPageData,
  ) => Promise<ISubjectPageData>;
  selectedLanguage: string;
  elementId: string;
  isNewlyCreated: boolean;
}

const subjectpageRules: RulesType<SubjectPageFormikType> = {
  title: {
    required: true,
  },
  description: {
    required: true,
    maxLength: 300,
  },
  visualElement: {
    required: true,
    test: (values: SubjectPageFormikType) => {
      const element = values?.visualElement[0];
      const data = Element.isElement(element) && element.type === TYPE_EMBED && element.data;
      const badVisualElementId = data && 'resource_id' in data && data.resource_id === '';
      return badVisualElementId
        ? { translationKey: 'subjectpageForm.missingVisualElement' }
        : undefined;
    },
  },
  metaDescription: {
    required: true,
    maxLength: 300,
  },
  desktopBanner: {
    required: true,
  },
};

const SubjectpageForm = ({
  elementId,
  subjectpage,
  selectedLanguage,
  updateSubjectpage,
  createSubjectpage,
  isNewlyCreated,
  editorsChoices,
  banner,
}: Props) => {
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const { createMessage, applicationError } = useMessages();
  const initialValues = subjectpageApiTypeToFormikType(
    subjectpage,
    elementId,
    selectedLanguage,
    editorsChoices,
    banner,
  );
  const [unsaved, setUnsaved] = useState(false);
  usePreventWindowUnload(unsaved);

  const fetchTaxonomyUrns = async (choices: (DraftApiType | Learningpath)[], language: string) => {
    const fetched = await Promise.all<Topic[] | Learningpath[] | Resource[]>(
      choices.map(choice => {
        if ('articleType' in choice && choice.articleType === 'topic-article') {
          return queryTopics(choice.id.toString(), language);
        } else if ('learningsteps' in choice && typeof choice.id === 'number') {
          return queryLearningPathResource(choice.id);
        }
        return queryResources(choice.id.toString(), language);
      }),
    );

    return fetched.map(resource => resource?.[0]?.id?.toString()).filter(e => e !== undefined);
  };

  const handleSubmit = async (formik: FormikProps<SubjectPageFormikType>) => {
    const { setSubmitting, values, resetForm, setFieldTouched, validateForm } = formik;
    setSubmitting(true);
    const urns = await fetchTaxonomyUrns(values.editorsChoices, selectedLanguage);
    try {
      if (values.id) {
        await updateSubjectpage?.(values.id, subjectpageFormikTypeToPatchType(values, urns));
      } else {
        await createSubjectpage?.(subjectpageFormikTypeToPostType(values, urns));
      }
      Object.keys(values).map(fieldName => setFieldTouched(fieldName, true, true));
      resetForm();
      setSavedToServer(true);
    } catch (err) {
      if (err?.status === 409) {
        createMessage({ message: t('alertModal.needToRefresh'), timeToLive: 0 });
      } else if (err?.json?.messages) {
        createMessage(formatErrorMessage(err));
      } else {
        applicationError(err);
      }
      setSubmitting(false);
      setSavedToServer(false);
    }
    await validateForm();
  };

  const initialErrors = validateFormik(initialValues, subjectpageRules, t);

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={() => {}}
      validate={values => validateFormik(values, subjectpageRules, t)}>
      {(formik: FormikProps<SubjectPageFormikType>) => {
        const { values, dirty, isSubmitting, errors, isValid } = formik;

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
              id={values.id!}
              isSubmitting={isSubmitting}
              language={values.language}
              supportedLanguages={values.supportedLanguages!}
              title={values.name}
            />
            <SubjectpageAccordionPanels
              editorsChoices={values.editorsChoices}
              elementId={values.elementId!}
              errors={errors}
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

export default SubjectpageForm;
