import React, { FC, Fragment } from 'react';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import { injectT } from '@ndla/i18n';
import {FieldProps, FormikErrors, FormikHelpers, FormikTouched, FormikValues} from 'formik';
import SubjectpageAbout from './SubjectpageAbout';
import SubjectpageMetadata from './SubjectpageMetadata';
import SubjectpageArticles from './SubjectpageArticles';
import {ArticleType, SubjectpageType, TranslateType} from '../../../interfaces';
import { Values } from '../../../components/SlateEditor/editorTypes';
import FormikField from '../../../components/FormikField';

interface Props {
  t: TranslateType;
  values: Values;
  errors: FormikErrors<Values>;
  subject: SubjectpageType;
  touched: FormikTouched<Values>;
  formIsDirty: boolean;
  getInitialValues: Function;
  setFieldTouched: boolean;
}

interface AccordionProps {
  openIndexes: string[];
  handleItemClick: Function;
}

interface ComponentProps {
  hasError: boolean;
  closePanel: Function;
  values: Values;
}

interface FormikProps{
  field: FieldProps<ArticleType[]>['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  }
}

const panels = [
  {
    id: 'about',
    title: 'subjectpageForm.about',
    className: 'u-4/6@desktop u-push-1/6@desktop',
    errorFields: ['title', 'description', 'visualElement'],
    component: () => <SubjectpageAbout />,
  },
  {
    id: 'metadata',
    title: 'subjectpageForm.metadata',
    className: 'u-6/6',
    errorFields: ['metaDescription', 'banner'],
    component: () => <SubjectpageMetadata />,
  },
  {
    id: 'articles',
    title: 'subjectpageForm.articles',
    className: 'u-6/6',
    errorFields: ['editorChoices'],
    component: ({ values }: ComponentProps) => (
        <FormikField name={"editorChoices"}>
            {({field, form}: FormikProps) => (
                <SubjectpageArticles
                  values={values}
                  field={field}
                  form={form}
                />
            )}
        </FormikField>

    ),
  },
];

const SubjectpageAccordionPanels: FC<Props> = ({
  t,
  values,
  errors,
                                               }) => {
  return (
    <Accordion openIndexes={['about']}>
      {({ openIndexes, handleItemClick }: AccordionProps) => (
        <AccordionWrapper>
          {panels.map(panel => {
            // @ts-ignore
            const hasError = panel.errorFields.some(field => !!errors[field]);
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
                        hasError,
                        values,
                        closePanel: () => handleItemClick(panel.id),
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
