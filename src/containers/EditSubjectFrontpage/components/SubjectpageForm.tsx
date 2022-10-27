/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useState } from 'react';
import { Element } from 'slate';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  ISubjectPageData,
  INewSubjectFrontPageData,
  IUpdatedSubjectFrontPageData,
} from '@ndla/types-frontpage-api';
import { IImageMetaInformationV2 } from '@ndla/types-image-api';
import { ILearningPathV2 } from '@ndla/types-learningpath-api';
import { IArticle } from '@ndla/types-draft-api';
import Field from '../../../components/Field';
import SimpleLanguageHeader from '../../../components/HeaderWithLanguage/SimpleLanguageHeader';
import { AlertModalWrapper } from '../../FormikForm';
import validateFormik, { RulesType } from '../../../components/formikValidationSchema';
import { isFormikFormDirty } from '../../../util/formHelper';
import { toEditSubjectpage } from '../../../util/routeHelpers';
import usePreventWindowUnload from '../../FormikForm/preventWindowUnloadHook';
import SubjectpageAccordionPanels from './SubjectpageAccordionPanels';
import SaveButton from '../../../components/SaveButton';
import {
  subjectpageApiTypeToFormikType,
  SubjectPageFormikType,
  subjectpageFormikTypeToPatchType,
  subjectpageFormikTypeToPostType,
} from '../../../util/subjectHelpers';
import { useMessages } from '../../Messages/MessagesProvider';
import { queryLearningPathResource, queryResources, queryTopics } from '../../../modules/taxonomy';
import { Resource, Topic } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { TYPE_EMBED } from '../../../components/SlateEditor/plugins/embed/types';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import StyledForm from '../../../components/StyledFormComponents';
import { NdlaErrorPayload } from '../../../util/resolveJsonOrRejectWithError';

interface Props {
  subjectpage?: ISubjectPageData;
  editorsChoices?: (IArticle | ILearningPathV2)[];
  banner?: IImageMetaInformationV2;
  elementName?: string;
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
  elementName,
  subjectpage,
  selectedLanguage,
  updateSubjectpage,
  createSubjectpage,
  isNewlyCreated,
  editorsChoices,
  banner,
}: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [savedToServer, setSavedToServer] = useState(false);
  const { createMessage, applicationError, formatErrorMessage } = useMessages();
  const initialValues = subjectpageApiTypeToFormikType(
    subjectpage,
    elementName,
    elementId,
    selectedLanguage,
    editorsChoices,
    banner,
  );
  const [unsaved, setUnsaved] = useState(false);
  usePreventWindowUnload(unsaved);

  const fetchTaxonomyUrns = async (choices: (IArticle | ILearningPathV2)[], language: string) => {
    const fetched = await Promise.all<Topic[] | ILearningPathV2[] | Resource[]>(
      choices.map(choice => {
        if ('articleType' in choice && choice.articleType === 'topic-article') {
          return queryTopics({ contentId: choice.id, language, taxonomyVersion });
        } else if ('learningsteps' in choice && typeof choice.id === 'number') {
          return queryLearningPathResource({ learningpathId: choice.id, taxonomyVersion });
        }
        return queryResources({ contentId: choice.id, language, taxonomyVersion });
      }),
    );

    return fetched.map(resource => resource?.[0]?.id?.toString()).filter(e => e !== undefined);
  };

  const handleSubmit = async (formik: FormikProps<SubjectPageFormikType>) => {
    const { setSubmitting, values, validateForm } = formik;
    setSubmitting(true);
    const urns = await fetchTaxonomyUrns(values.editorsChoices, selectedLanguage);
    try {
      if (values.id) {
        await updateSubjectpage?.(values.id, subjectpageFormikTypeToPatchType(values, urns));
      } else {
        await createSubjectpage?.(subjectpageFormikTypeToPostType(values, urns));
      }
      setSavedToServer(true);
    } catch (e) {
      const err = e as NdlaErrorPayload;
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
      enableReinitialize
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
          <StyledForm>
            <SimpleLanguageHeader
              articleType={values.articleType!}
              editUrl={(lang: string) => toEditSubjectpage(values.elementId!, lang, values.id)}
              id={values.id!}
              isSubmitting={isSubmitting}
              language={values.language}
              supportedLanguages={values.supportedLanguages!}
              title={values.name ?? ''}
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
          </StyledForm>
        );
      }}
    </Formik>
  );
};

export default SubjectpageForm;
