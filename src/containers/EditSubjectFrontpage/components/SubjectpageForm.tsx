/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, Fragment, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { Formik, Form } from 'formik';
import Accordion, {
  AccordionWrapper,
  AccordionBar,
  AccordionPanel,
} from '@ndla/accordion';
import { Footer } from '@ndla/editor';
import { SubjectType, TranslateType } from '../../../interfaces';
import SubjectpageAbout from './SubjectpageAbout';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage/HeaderWithLanguage';
import SubjectpageMetadata from './SubjectpageMetadata';
import SubjectpageArticles  from './SubjectpageArticles';
import { FormikAlertModalWrapper, formClasses } from '../../FormikForm';
import { isFormikFormDirty } from '../../../util/formHelper';
import { toEditSubjectpage } from '../../../util/routeHelpers';
import usePreventWindowUnload from '../../FormikForm/preventWindowUnloadHook';
import SaveMultiButton from '../../../components/SaveMultiButton';

interface Props {
  t: TranslateType;
  subject: SubjectType;
  selectedLanguage: String;
  subjectId: string;
}

interface ComponentProps {
  hasError: boolean;
  t: TranslateType;
  closePanel: Function;
  editorsChoices: string[];
}

interface AccordionProps {
  openIndexes: string[];
  handleItemClick: Function;
}

const SubjectpageForm: FC<Props> = ({
  t,
  subjectId,
  subject,
  selectedLanguage,
}) => {
  const [unsaved, setUnsaved] = useState(false);
  usePreventWindowUnload(unsaved);

  const panels = [
    {
      id: 'subjectpage-about',
      title: 'subjectpageForm.about',
      className: 'u-4/6@desktop u-push-1/6@desktop',
      errorFields: ['title', 'description', 'visualElement'],
      component: ({ t }: ComponentProps) => <SubjectpageAbout />,
    },
    {
      id: 'subjectpage-metadata',
      title: 'subjectpageForm.metadata',
      className: 'u-6/6',
      errorFields: ['metaDescription', 'banner'],
      component: ({ t, hasError, closePanel }: ComponentProps) => (
        <SubjectpageMetadata t={t} />
      ),
    },
    {
      id: 'subjectpage-articles',
      title: 'subjectpageForm.articles',
      className: 'u-6/6',
      errorFields: ['editorChoices', 'mostRead'],
      component: ({ editorsChoices }: ComponentProps) => (
        <SubjectpageArticles articles={editorsChoices} />
      ),
    },
  ];

  const getInitialValues = (subject: SubjectType) => {
    const visualElementId = subject.about.visualElement.url.split('/').pop();
    return {
      articleType: 'subjectpage',
      supportedLanguages: ['nb', 'nn'],
      language: selectedLanguage,
      description: subject.about.description,
      aboutTitle: subject.about.title,
      visualElement: {
        resource: subject.about.visualElement.type,
        url: subject.about.visualElement.url,
        alt: subject.about.visualElement.alt,
        resource_id: visualElementId,
      },
      visualElementAlt: subject.about.visualElement.alt,
      visualElementCaption: subject.about.visualElement.caption,
      image: subject.banner.desktopId,
      bannerUrl: {
        desktopUrl: subject.banner.desktopUrl,
        mobileUrl: subject.banner.mobileUrl,
      },
      desktopBannerId: subject.banner.desktopId,
      mobileBannerId: subject.banner.mobileId,
      editorsChoices: subject.editorsChoices,
      facebook: subject.facebook,
      filters: subject.filters,
      goTo: subject.goTo,
      id: subject.id,
      latestContent: subject.latestContent,
      layout: subject.layout,
      metaDescription: subject.metaDescription,
      mostRead: subject.mostRead,
      title: subject.name,
      topical: subject.topical,
      twitter: subject.twitter,
      subjectId: subjectId,
    };
  };

  const initialValues = getInitialValues(subject);
  const editorsChoices = initialValues.editorsChoices;

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={() => {}}>
      {({ values, dirty, isSubmitting, setValues, errors, touched }) => {
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });

        setUnsaved(formIsDirty);

        var savedToServer = true;
        const onSaveClick = () => {
          savedToServer = true;
        };

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
              //translateArticle + setTranslateOnContinue, vet ikke helt hva de gjør
              noStatus
            />
            <Accordion openIndexes={['subjectpage-about']}>
              {({ openIndexes, handleItemClick }: AccordionProps) => (
                <AccordionWrapper>
                  {panels.map(panel => {
                    const hasError = false; //panel.errorFields.some(field => !!errors[field]);
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
                                t,
                                editorsChoices,
                                closePanel: () => handleItemClick(panel.id),
                              })}
                            </div>
                          </AccordionPanel>
                        )}
                      </Fragment>
                    );
                  })}
                  <Footer style={{ display: 'flex' }}>
                    <SaveMultiButton
                      large
                      isSaving={isSubmitting}
                      formIsDirty={formIsDirty}
                      showSaved={!formIsDirty && savedToServer}
                      onClick={() => {
                        onSaveClick();
                      }}
                      hideSecondaryButton={true}
                      style={{ marginLeft: 'auto' }}
                      touched={touched}
                    />
                  </Footer>
                </AccordionWrapper>
              )}
            </Accordion>
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
