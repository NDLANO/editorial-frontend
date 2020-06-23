/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect, FC, Fragment } from 'react';
import Accordion, { AccordionWrapper, AccordionBar, AccordionPanel } from '@ndla/accordion';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import SaveButton from "../../components/SaveButton";
import HeaderWithLanguage from '../../components/HeaderWithLanguage/HeaderWithLanguage';
import { FormikMetadata } from '../FormikForm'
import FormikField from '../../components/FormikField';
import { fetchSubjectFrontpage } from '../../modules/frontpage/frontpageApi';
import { TranslateType, SubjectType } from '../../interfaces';
import SubjectFrontpageAbout from './components/SubjectFrontpageAbout';
import SubjectFrontpageArticles from './components/SubjectFrontpageArticles';
import TopicArticleContent from '../TopicArticlePage/components/TopicArticleContent'
import SlideshowEditor from '../NdlaFilm/components/SlideshowEditor'
import {FieldInputProps, Formik} from "formik";
import { Values } from "../../components/SlateEditor/editorTypes";
import { parseEmbedTag } from '../../util/embedTagHelpers';


interface Props {
    t: TranslateType;
    id: number;
}

interface AccordionProps{
    openIndexes: string[];
    handleItemClick: Function;
}

interface ComponentProps{
    t: TranslateType;
    hasError: boolean;
    closePanel: Function;
    values: string;
}


const emptySubject = {
    id : '',
    name: 'asdasd',
    filters: [],
    layout: '',
    twitter: 'sdfsdf',
    facebook: '',
    banner: {
        mobileUrl: '',
        mobileId: 0,
        desktopUrl: '',
        desktopId: 0,
    },
    about: {
        title: '',
        description: '',
    },
    visualElement: {
        type: '',
        url: '',
        alt: '',
    },
    metaDescription: '',
    topical: '',
    mostRead: [],
    editorsChoices: [],
    latestContent: [],
    goTo: [],
}

const EditSubjectFrontpage : FC<Props> = ({
    t,
    id,
}) => {
    const [content, setContent] = useState<SubjectType>(emptySubject);

    const getInitialValues = (subject : SubjectType ) => {
        const visualElement = parseEmbedTag(subject?.visualElement || '');
        return {
            about: {
                description: subject.about.description,
                title: subject.about.title,
            },
            visualElement: {
                type: subject.visualElement?.type,
                url: subject.visualElement?.url,
                alt: subject.visualElement?.alt,
            },
            banner: {
                desktopId: subject.banner.desktopId,
                desktopUrl: subject.banner.desktopUrl,
                mobileId: subject.banner.mobileId,
                mobileUrl: subject.banner.mobileUrl,
            },
            editorsChoices: subject.editorsChoices, //hente ut de elementene? evt mappe ut id?
            facebook: subject.facebook,
            filters: subject.filters,
            goTo: subject.goTo,
            id: subject.id,
            latestContent: subject.latestContent, //hente ut elementene?
            layout: subject.layout,
            metaDescription: subject.metaDescription,
            mostRead: subject.mostRead,
            name: subject.name,
            topical: subject.topical, //hente ut elementene?
            twitter: subject.twitter,
        }
    }

    useEffect(() => {
        const fetchSubject = async() => {
            const subject : SubjectType = await fetchSubjectFrontpage(1);

            setContent(getInitialValues(subject));
        }
        fetchSubject();
    }, []);

    const initialValues = getInitialValues(content);

    //TODO: Hvor skal disse komme fra?
    const values = () => {
        return{
            articleType: "subject-frontpage",
            supportedLanguages: ["nb", "nn", "en"],
            language: "nb",
        };
    }

    const panels = [
        {
            id: 'subject-frontpage-about',
            title: 'subjectFrontpageForm.about',
            className: 'u-4/6@desktop u-push-1/6@desktop',
            errorFields: ['title', 'description', 'visualElement'],
            component: ({ t, values } : ComponentProps) => <SubjectFrontpageAbout values={values} />, //SubjectFrontPageAbout
        },
        {
            id: 'subject-frontpage-metadata',
            title: 'subjectFrontpageForm.metadata',
            className: 'u-6/6',
            errorFields: ['metaDescription', 'banner'],
            component: ({ t } : ComponentProps) => <FormikMetadata t={t} />,
        },
        {
            id: 'subject-frontpage-articles',
            title: 'subjectFrontpageForm.articles',
            className: 'u-6/6',
            errorFields: ['editorChoices', 'mostRead'],
            component: ({ t } : ComponentProps) => <div />,
        }
    ];

    console.log(initialValues);

    return (
    <Formik
        initialValues={content}
        //TODO: Fix onsubmit
        onSubmit={(values, actions) => {
            console.log({values, actions});
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
        }}>
        {(formik : FieldInputProps<string>) => {
            console.log(formik);

            return (<>
                <HeaderWithLanguage
                    content={content}
                    values={values()}
                />
            <Accordion openIndexes={[]}>

                {({openIndexes, handleItemClick } : AccordionProps) => (
                    <AccordionWrapper>
                        {panels.map(panel => {
                            const hasError = false //panel.errorFields.some(field => !!errors[field]);
                            return <Fragment key={panel.id}>
                                <AccordionBar
                                    panelId={panel.id}
                                    ariaLabel={t(panel.title)}
                                    onClick={() => handleItemClick( panel.id )} //TODO: fix open handleItemClick('subject-frontpage-about')
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
                                                values: content.name,
                                                t,
                                                closePanel: () => handleItemClick( panel.id ),
                                            })}
                                        </div>
                                    </AccordionPanel>
                                )}
                            </Fragment>;
                        })}
                    </AccordionWrapper>
                )}
            </Accordion>
                </>
            )
        }

        }
    </Formik>
    );
};

export default injectT(EditSubjectFrontpage);
