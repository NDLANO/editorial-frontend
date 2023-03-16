/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { Accordions, AccordionSection } from '@ndla/accordion';
import { useTranslation } from 'react-i18next';
import { FieldProps, FormikErrors, FormikHelpers, FormikValues } from 'formik';
import SubjectpageAbout from '../../EditSubjectFrontpage/components/SubjectpageAbout';
import { Values } from '../../../components/SlateEditor/editorTypes';
import ThemeEditor from './ThemeEditor';
import SlideshowEditor from './SlideshowEditor';
import FormikField from '../../../components/FormikField';

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
    <Accordions>
      <AccordionSection
        id="about"
        title={t('subjectpageForm.about')}
        className="u-4/6@desktop u-push-1/6@desktop"
        hasError={['title', 'description', 'visualElement'].some((field) => field in errors)}
      >
        <SubjectpageAbout selectedLanguage={selectedLanguage} />
      </AccordionSection>
      <AccordionSection
        id="slideshow"
        title={t('ndlaFilm.editor.slideshowHeader')}
        className="u-6/6"
        hasError={['metaDescription', 'mobileBannerId'].some((field) => field in errors)}
        startOpen
      >
        <FormikField name={'slideShow'}>
          {() => <SlideshowEditor onUpdateSlideshow={onUpdateMovieList} fieldName={'slideShow'} />}
        </FormikField>
      </AccordionSection>
      <AccordionSection
        id="themes"
        title={t('ndlaFilm.editor.movieGroupHeader')}
        className="u-6/6"
        hasError={['editorsChoices'].some((field) => field in errors)}
        startOpen
      >
        <FormikField name={'themes'}>
          {() => (
            <ThemeEditor
              onUpdateMovieTheme={onUpdateMovieList}
              selectedLanguage={selectedLanguage}
            />
          )}
        </FormikField>
      </AccordionSection>
    </Accordions>
  );
};

export default SubjectpageAccordionPanels;
