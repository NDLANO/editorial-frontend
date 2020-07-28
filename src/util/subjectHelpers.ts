import { SubjectpageApiType, SubjectpageEditType } from '../interfaces';

export const getIdFromUrn = (urnId: string | undefined) =>
  urnId?.replace('urn:frontpage:', '');

export const getUrnFromId = (id: number) => `urn:frontpage:${id}`;

export const transformSubjectFromApiVersion = (
  subject: SubjectpageApiType,
  subjectId: string,
  selectedLanguage: string,
) => {
  const visualElementId = subject.about.visualElement.url.split('/').pop();
  const subjectpageEditType: SubjectpageEditType = {
    id: subject.id,
    filters: subject.filters,
    layout: subject.layout,
    twitter: subject.twitter,
    facebook: subject.facebook,
    mobileBanner: subject.banner.mobileId,
    desktopBanner: subject.banner.desktopId,
    name: subject.name,
    description: subject.about.description,
    title: subject.about.title,
    visualElement: {
      url: subject.about.visualElement.url,
      resource: subject.about.visualElement.type,
      resource_id: visualElementId || '',
    },
    visualElementAlt: subject.about.visualElement.alt,
    metaDescription: subject.metaDescription,
    topical: subject.topical,
    mostRead: subject.mostRead,
    latestContent: subject.latestContent,
    goTo: subject.goTo,
    language: selectedLanguage,
    editorsChoices: subject.editorsChoices,
    subjectId: subjectId,
    supportedLanguages: subject.supportedLanguages,
  };
  return subjectpageEditType;
};

//TODO: håndtere de feltene som ikke settes i formen, hvordan skal det gjøres for nye artikler?
export const transformSubjectToApiVersion = (subject: SubjectpageEditType) => {
  return {
    externalId: '', //??
    name: subject.name,
    filters: subject.filters,
    layout: subject.layout, //??
    twitter: subject.twitter,
    facebook: subject.facebook,
    bannerImage: {
      mobileImageId: +subject.mobileBanner,
      desktopImageId: +subject.desktopBanner,
    },
    about: [{
      title: subject.title,
      description: subject.description,
      language: subject.language,
      visualElement: {
        type: subject.visualElement.resource,
        id: subject.visualElement.resource_id,
        alt: subject.visualElementAlt,
      },
    }],
    metaDescription: [{
      metaDescription: subject.metaDescription,
      language: subject.language,
    }],
    topical: subject.topical,
    mostRead: subject.mostRead,
    editorsChoices: subject.editorsChoices,
    latestContent: subject.latestContent,
    goTo: subject.goTo,
  };
};
