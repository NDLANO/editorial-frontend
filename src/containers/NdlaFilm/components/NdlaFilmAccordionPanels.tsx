/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import React, { FC, Fragment } from 'react';
import Accordion, { AccordionWrapper, AccordionBar, AccordionPanel } from '@ndla/accordion';
import { injectT, tType } from '@ndla/i18n';
import { FieldProps, FormikErrors, FormikHelpers, FormikValues } from 'formik';
import SubjectpageAbout from '../../EditSubjectFrontpage/components/SubjectpageAbout';
import {
  AccordionProps,
  ContentResultType,
  FormikProperties,
  NdlaFilmThemesEditType,
} from '../../../interfaces';
import { Values } from '../../../components/SlateEditor/editorTypes';
import ThemeEditor from './ThemeEditor';
import SlideshowEditor from './SlideshowEditor';
import FormikField from '../../../components/FormikField';

interface Props {
  allMovies: Array<ContentResultType>;
  loading: boolean;
  selectedLanguage: string;
}

interface ComponentProps extends Props {
  errors: FormikErrors<Values>;
  formIsDirty: boolean;
  handleSubmit: () => void;
}

interface PanelProps extends Props {
  onUpdateMovieList: Function;
}

interface FormikSlideshowProps {
  field: FieldProps<ContentResultType[]>['field'];
  form: FormikProperties['form'];
}

interface FormikThemeProps {
  field: FieldProps<NdlaFilmThemesEditType[]>['field'];
  form: FormikProperties['form'];
}

const panels = [
  {
    id: 'about',
    title: 'subjectpageForm.about',
    className: 'u-4/6@desktop u-push-1/6@desktop',
    errorFields: ['title', 'description', 'visualElement'],
    component: ({ handleSubmit }: { handleSubmit: () => void }) => (
      <SubjectpageAbout handleSubmit={handleSubmit} />
    ),
  },
  {
    id: 'slideshow',
    title: 'ndlaFilm.editor.slideshowHeader',
    className: 'u-6/6',
    errorFields: ['metaDescription', 'mobileBannerId'],
    component: ({ allMovies, onUpdateMovieList, loading }: PanelProps) => (
      <FormikField name={'slideShow'}>
        {({ field, form }: FormikSlideshowProps) => (
          <SlideshowEditor
            field={field}
            form={form}
            allMovies={allMovies}
            onUpdateSlideshow={onUpdateMovieList}
            loading={loading}
          />
        )}
      </FormikField>
    ),
  },
  {
    id: 'themes',
    title: 'ndlaFilm.editor.movieGroupHeader',
    className: 'u-6/6',
    errorFields: ['editorsChoices'],
    component: ({ allMovies, onUpdateMovieList, loading, selectedLanguage }: PanelProps) => (
      <FormikField name={'themes'}>
        {({ field, form }: FormikThemeProps) => (
          <ThemeEditor
            field={field}
            form={form}
            allMovies={allMovies}
            onUpdateMovieTheme={onUpdateMovieList}
            loading={loading}
            selectedLanguage={selectedLanguage}
          />
        )}
      </FormikField>
    ),
  },
];

const SubjectpageAccordionPanels: FC<ComponentProps & tType> = ({
  t,
  errors,
  allMovies,
  loading,
  selectedLanguage,
  handleSubmit,
}) => {
  const onUpdateMovieList = (
    field: FieldProps<FormikValues>['field'],
    form: FormikHelpers<FormikValues>,
    movieList: ContentResultType[],
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
    <Accordion openIndexes={['slideshow', 'themes']}>
      {({ openIndexes, handleItemClick }: AccordionProps) => (
        <AccordionWrapper>
          {panels.map(panel => {
            const hasError = panel.errorFields.some(field => field in errors);
            return (
              <Fragment key={panel.id}>
                <AccordionBar
                  panelId={panel.id}
                  ariaLabel={t(panel.title)}
                  onClick={() => handleItemClick(panel.id)}
                  title={t(panel.title)}
                  hasError={hasError}
                  isOpen={openIndexes.includes(panel.id)}
                />
                {openIndexes.includes(panel.id) && (
                  <AccordionPanel
                    id={panel.id}
                    hasError={hasError}
                    isOpen={openIndexes.includes(panel.id)}>
                    <div className={panel.className}>
                      {panel.component({
                        allMovies,
                        loading,
                        onUpdateMovieList,
                        selectedLanguage,
                        handleSubmit,
                      })}
                    </div>
                  </AccordionPanel>
                )}
              </Fragment>
            );
          })}
        </AccordionWrapper>
      )}
    </Accordion>
  );
};

export default injectT(SubjectpageAccordionPanels);
