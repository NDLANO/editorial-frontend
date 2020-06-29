import {withRouter} from "react-router";
import React, {FC} from "react";
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import {RouteComponentProps} from "react-router-dom";
import {TranslateType} from "../../interfaces";
import SubjectpageForm from "./components/SubjectpageForm";

const emptySubjectpage = {
    id: '',
    name: '',
    filters: [],
    layout: '',
    twitter: '',
    facebook: '',
    banner: {
        mobileUrl: '',
        mobileId: 0,
        desktopUrl: '',
        desktopId: 0,
    },
    about: {
        visualElement: {
            type: '',
            url: '',
            alt: '',
            resource_id: '',
        },
        title: '',
        description: '',
    },
    metaDescription: '',
    topical: '',
    mostRead: [],
    editorsChoices: [],
    latestContent: [],
    goTo: [],
};

interface Props{
    t: TranslateType;
}

const CreateSubjectpage : FC<RouteComponentProps & Props> = ({t}) => {
    return (
        <>

            <HelmetWithTracker title={t('htmlTitles.createSubjectpage')}/>
            <SubjectpageForm/>


        </>);
}

export default injectT(withRouter(CreateSubjectpage));