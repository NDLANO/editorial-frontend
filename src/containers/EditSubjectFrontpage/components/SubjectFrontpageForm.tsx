import React, {FC} from "react";
import {injectT} from "@ndla/i18n";
import { TranslateType } from '../../../interfaces';

interface Props{
    t: TranslateType;
    id: String;
}

const SubjectFrontPageForm : FC<Props> = ({
    t,
    id,
}) => {
    return <div/>
}

export default injectT(SubjectFrontPageForm);