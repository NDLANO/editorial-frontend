import React, {FC} from 'react';
import { injectT } from '@ndla/i18n';
import {SubjectType, TranslateType} from '../../../interfaces';
import TopicArticleVisualElement from '../../TopicArticlePage/components/TopicArticleVisualElement';
import {Formik} from "formik";
import FormikField from '../../../components/FormikField'
import validateFormik from '../../../components/formikValidationSchema';
import { topicArticleRules } from '../../../util/formHelper';

interface Props{
    t: TranslateType;
    values: string;
    formik: FormikProps;
}

interface FormikProps{
    id: string,
    name: string,
    filters: string[],
    visualElement: Object,
}

const SubjectFrontpageAbout : FC<Props> = ({
    t,
    values
}) => {

    return(<>
        <FormikField
            label={t('form.title.label')}
            name='name'
            noBorder
            placeholder={t('form.title.label')}>


        </FormikField>
        </>
    )
}

export default injectT(SubjectFrontpageAbout);