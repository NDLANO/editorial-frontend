import {ArticleType, SubjectpageType} from "../interfaces";

export const transformSubjectFromApiVersion = (subject : SubjectpageType, editorsChoices: ArticleType[]) => ({
    ...subject,
    editorsChoices: editorsChoices,
})