/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IArticle } from '@ndla/types-backend/draft-api';
import {
  ISubjectPageData,
  INewSubjectFrontPageData,
  IUpdatedSubjectFrontPageData,
} from '@ndla/types-backend/frontpage-api';
import { ILearningPathV2 } from '@ndla/types-backend/learningpath-api';

import SubjectpageAccordionPanels from './SubjectpageAccordionPanels';
import Field from '../../../components/Field';
import validateFormik, { RulesType } from '../../../components/formikValidationSchema';
import SimpleLanguageHeader from '../../../components/HeaderWithLanguage/SimpleLanguageHeader';
import SaveButton from '../../../components/SaveButton';
import { isSlateEmbed } from '../../../components/SlateEditor/plugins/embed/utils';
import StyledForm from '../../../components/StyledFormComponents';
import { SAVE_BUTTON_ID } from '../../../constants';
import { fetchNodes } from '../../../modules/nodes/nodeApi';
import { isFormikFormDirty } from '../../../util/formHelper';
import { NdlaErrorPayload } from '../../../util/resolveJsonOrRejectWithError';
import { toEditSubjectpage } from '../../../util/routeHelpers';
import {
  subjectpageApiTypeToFormikType,
  SubjectPageFormikType,
  subjectpageFormikTypeToPatchType,
  subjectpageFormikTypeToPostType,
} from '../../../util/subjectHelpers';
import { AlertModalWrapper } from '../../FormikForm';
import usePreventWindowUnload from '../../FormikForm/preventWindowUnloadHook';
import { useMessages } from '../../Messages/MessagesProvider';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';

interface Props {
  subjectpage?: ISubjectPageData;
  editorsChoices?: (IArticle | ILearningPathV2)[];
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
      const data = isSlateEmbed(element) && element.data;
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
  desktopBannerId: {
    required: true,
  },
  mobileBannerId: {
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
  );
  const [unsaved, setUnsaved] = useState(false);
  usePreventWindowUnload(unsaved);

  const fetchTaxonomyUrns = async (choices: (IArticle | ILearningPathV2)[], language: string) => {
    const fetched = await Promise.all(
      choices.map((choice) => {
        if ('articleType' in choice && choice.articleType === 'topic-article') {
          return fetchNodes({
            contentURI: `urn:article:${choice.id}`,
            nodeType: 'TOPIC',
            language,
            taxonomyVersion,
          });
        } else if ('learningsteps' in choice && typeof choice.id === 'number') {
          return fetchNodes({
            contentURI: `urn:learningpath:${choice.id}`,
            nodeType: 'RESOURCE',
            taxonomyVersion,
          });
        }
        return fetchNodes({
          contentURI: `urn:article:${choice.id}`,
          nodeType: 'RESOURCE',
          language,
          taxonomyVersion,
        });
      }),
    );

    return fetched.map((resource) => resource?.[0]?.id?.toString()).filter((e) => e !== undefined);
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
      validate={(values) => validateFormik(values, subjectpageRules, t)}
    >
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
              editUrl={(_, lang: string) => toEditSubjectpage(values.elementId!, lang, values.id)}
              id={values.id!}
              isSubmitting={isSubmitting}
              language={values.language}
              supportedLanguages={values.supportedLanguages!}
              title={values.name ?? ''}
            />
            <SubjectpageAccordionPanels
              buildsOn={values.buildsOn}
              connectedTo={values.connectedTo}
              editorsChoices={values.editorsChoices}
              elementId={values.elementId!}
              errors={errors}
              leadsTo={values.leadsTo}
            />
            <Field right>
              <SaveButton
                id={SAVE_BUTTON_ID}
                size="large"
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
