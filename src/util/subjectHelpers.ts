import { ArticleType, SubjectpageType } from '../interfaces';

export const transformSubjectFromApiVersion = (
  subject: SubjectpageType,
  editorsChoicesIds: number[],
  editorsChoices: ArticleType[],
  subjectId: number,
) => {
  return {
  ...subject,
  editorsChoicesIds: editorsChoicesIds,
  editorsChoices: editorsChoices,
  subjectId: subjectId,
  }
};
