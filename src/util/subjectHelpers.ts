import { ArticleType, SubjectpageType } from '../interfaces';
import {Article} from "../components/SlateEditor/editorTypes";

export const transformSubjectFromApiVersion = (
  subject: SubjectpageType,
  visualElementType: string,
  editorsChoices: ArticleType[],
  subjectId: number,
) => {
  return {
    ...subject,
    about: {
      ...subject.about,
      visualElement: {
        ...subject.about.visualElement,
        resource: visualElementType,
      },
    },
    editorsChoices: editorsChoices,
    subjectId: subjectId,
  };
};

//TODO: håndtere de feltene som ikke settes i formen, hvordan skal det gjøres for nye artikler?
export const transformSubjectToApiVersion = (subject: SubjectpageType) => {
  const editorsChoices = subject.editorsChoices.map((x : ArticleType) => x.id);
  return {
    externalId: "", //??
    name: subject.name,
      filters: subject.filters, //??
    layout: "single", //??
      twitter: subject.twitter, //??
      facebook: subject.facebook, //??
    bannerImage: {
      mobileImageId: subject.banner.mobileId,
      desktopImageId: subject.banner.desktopId,
    },
    about: {
      title: subject.about.title,
      description: subject.about.description,
      //language? er i domain-modellen, men ikke i api
      visualElement: {
        type: subject.about.visualElement.resource,
        id: subject.about.visualElement.url.split("/").pop(),
        alt: subject.about.visualElement.alt,
      },
    },
    metaDescription: [
      {
        metaDescription: subject.metaDescription,
      language: "nb",
      }
    ],
      topical: subject.topical, //??
    mostRead: subject.mostRead, //??
    editorsChoices: editorsChoices,
      latestContent: subject.latestContent, //??
    goTo: subject.goTo, //??
  }
};

