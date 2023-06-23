/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { useTranslation } from 'react-i18next';
import { FieldProps, FormikErrors, FormikHelpers, FormikValues } from 'formik';
import SubjectpageAbout from '../../EditSubjectFrontpage/components/SubjectpageAbout';
import { Values } from '../../../components/SlateEditor/editorTypes';
import ThemeEditor from './ThemeEditor';
import SlideshowEditor from './SlideshowEditor';
import FormikField from '../../../components/FormikField';
import FormAccordions from '../../../components/Accordion/FormAccordions';
import FormAccordion from '../../../components/Accordion/FormAccordion';

interface Props {
  selectedLanguage: string;
}

interface ComponentProps extends Props {
  errors: FormikErrors<Values>;
  formIsDirty: boolean;
}

const SubjectpageAccordionPanels = ({ errors, selectedLanguage }: ComponentProps) => {
  const { t } = useTranslation();
  const onUpdateMovieList = (
    field: FieldProps<FormikValues>['field'],
    form: FormikHelpers<FormikValues>,
    movieList: string[],
  ) => {
    form.setFieldTouched(field.name, true, false);
    field.onChange({
      target: {
        name: field.name,
        value: movieList || [],
      },
    });
  };

  return (
    <FormAccordions defaultOpen={['slideshow', 'themes']}>
      <FormAccordion
        id="about"
        title={t('subjectpageForm.about')}
        className="u-4/6@desktop u-push-1/6@desktop"
        hasError={['title', 'description', 'visualElement'].some((field) => field in errors)}
      >
        <SubjectpageAbout selectedLanguage={selectedLanguage} />
      </FormAccordion>
      <FormAccordion
        id="slideshow"
        title={t('ndlaFilm.editor.slideshowHeader')}
        className="u-6/6"
        hasError={['metaDescription', 'mobileBannerId'].some((field) => field in errors)}
      >
        <FormikField name={'slideShow'}>
          {() => <SlideshowEditor onUpdateSlideshow={onUpdateMovieList} fieldName={'slideShow'} />}
        </FormikField>
      </FormAccordion>
      <FormAccordion
        id="themes"
        title={t('ndlaFilm.editor.movieGroupHeader')}
        className="u-6/6"
        hasError={['editorsChoices'].some((field) => field in errors)}
      >
        <FormikField name={'themes'}>
          {() => (
            <ThemeEditor
              onUpdateMovieTheme={onUpdateMovieList}
              selectedLanguage={selectedLanguage}
            />
          )}
        </FormikField>
      </FormAccordion>
    </FormAccordions>
  );
};

export default SubjectpageAccordionPanels;
