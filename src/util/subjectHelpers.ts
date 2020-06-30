import { ArticleType, SubjectpageType } from '../interfaces';

export const transformSubjectFromApiVersion = (
  subject: SubjectpageType,
  editorsChoices: ArticleType[],
  subjectId: number,
) => ({
  ...subject,
  editorsChoices: editorsChoices,
  subjectId: subjectId,
});
