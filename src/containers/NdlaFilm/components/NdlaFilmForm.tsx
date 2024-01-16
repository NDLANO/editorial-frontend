/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Descendant } from 'slate';
import { IFilmFrontPageData, IMovieTheme } from '@ndla/types-backend/frontpage-api';
import NdlaFilmAccordionPanels from './NdlaFilmAccordionPanels';
import Field from '../../../components/Field';
import validateFormik, { RulesType } from '../../../components/formikValidationSchema';
import SimpleLanguageHeader from '../../../components/HeaderWithLanguage/SimpleLanguageHeader';
import SaveButton from '../../../components/SaveButton';
import { isSlateEmbed } from '../../../components/SlateEditor/plugins/embed/utils';
import StyledForm from '../../../components/StyledFormComponents';
import { SAVE_BUTTON_ID } from '../../../constants';
import { isFormikFormDirty } from '../../../util/formHelper';
import { toEditNdlaFilm } from '../../../util/routeHelpers';
import { AlertModalWrapper } from '../../FormikForm/index';
import { useNdlaFilmFormHooks } from '../../FormikForm/ndlaFilmFormHooks';
import usePreventWindowUnload from '../../FormikForm/preventWindowUnloadHook';

interface Props {
  filmFrontpage: IFilmFrontPageData;
  selectedLanguage: string;
}

export interface FilmFormikType {
  articleType: string;
  name: string;
  title: Descendant[];
  description: Descendant[];
  visualElement: Descendant[];
  language: string;
  supportedLanguages: string[];
  slideShow: string[];
  themes: IMovieTheme[];
  article?: string;
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
    test: (values: FilmFormikType) => {
      const element = values?.visualElement[0];
      const data = isSlateEmbed(element) && element.data;
      const badVisualElementId = data && 'resource_id' in data && data.resource_id === '';
      return badVisualElementId
        ? { translationKey: 'subjectpageForm.missingVisualElement' }
        : undefined;
    },
  },
};

const NdlaFilmForm = ({ filmFrontpage, selectedLanguage }: Props) => {
  const { t } = useTranslation();
  const { savedToServer, handleSubmit, initialValues } = useNdlaFilmFormHooks(
    filmFrontpage,
    selectedLanguage,
  );
  const [unsaved, setUnsaved] = useState(false);
  usePreventWindowUnload(unsaved);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}}
      validate={(values) => validateFormik(values, ndlaFilmRules, t)}
      enableReinitialize={true}
    >
      {(formik) => {
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
              articleType={values.articleType}
              editUrl={(_, lang) => toEditNdlaFilm(lang)}
              id={20}
              isSubmitting={isSubmitting}
              language={selectedLanguage}
              supportedLanguages={values.supportedLanguages}
              title={values.name}
            />
            <NdlaFilmAccordionPanels
              errors={errors}
              formIsDirty={formIsDirty}
              selectedLanguage={selectedLanguage}
              handleSubmit={handleSubmit}
            />
            <Field right>
              <SaveButton
                id={SAVE_BUTTON_ID}
                size="large"
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
          </StyledForm>
        );
      }}
    </Formik>
  );
};

export default NdlaFilmForm;
