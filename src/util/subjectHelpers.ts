import {
  ArticleType,
  SubjectpageApiType,
  SubjectpageEditType,
  VisualElement,
} from '../interfaces';

export const getIdFromUrn = (urnId: string | undefined) =>
  urnId?.replace('urn:frontpage:', '');

export const getUrnFromId = (id: number) => `urn:frontpage:${id}`;

export const transformSubjectFromApiVersion = (
  subject: SubjectpageApiType,
  subjectId: string,
  selectedLanguage: string,
  editorsChoices: ArticleType[],
  banner: VisualElement,
) => {
  const visualElementVideoId = subject.about.visualElement.url
    .split('videoId=')
    .pop();
  const visualElementImageId = subject.about.visualElement.url.split('/').pop();

  const subjectpageEditType: SubjectpageEditType = {
    id: subject.id,
    filters: subject.filters,
    layout: subject.layout,
    twitter: subject.twitter,
    facebook: subject.facebook,
    mobileBanner: subject.banner.mobileId,
    desktopBanner: banner,
    name: subject.name,
    description: subject.about.description,
    title: subject.about.title,
    visualElement: {
      url: subject.about.visualElement?.url,
      resource: subject.about.visualElement?.type,
      resource_id: visualElementImageId || '',
      videoid: visualElementVideoId || '',
    },
    visualElementAlt: subject.about.visualElement?.alt,
    metaDescription: subject.metaDescription,
    topical: subject.topical,
    mostRead: subject.mostRead,
    latestContent: subject.latestContent,
    goTo: subject.goTo,
    language: selectedLanguage,
    editorsChoices: editorsChoices,
    subjectId: subjectId,
    supportedLanguages: subject.supportedLanguages,
  };
  return subjectpageEditType;
};

export const transformSubjectToApiVersion = (
  subject: SubjectpageEditType,
  editorsChoices: string[],
) => {
  const id = subject.visualElement.videoid || subject.visualElement.resource_id;
  return {
    name: subject.name,
    filters: subject.filters,
    layout: subject.layout,
    twitter: subject.twitter,
    facebook: subject.facebook,
    banner: {
      mobileImageId: subject.mobileBanner,
      desktopImageId: parseInt(subject.desktopBanner.resource_id),
    },
    about: [
      {
        title: subject.title,
        description: subject.description,
        language: subject.language,
        visualElement: {
          type: subject.visualElement.resource,
          id: id,
          alt: subject.visualElementAlt,
        },
      },
    ],
    metaDescription: [
      {
        metaDescription: subject.metaDescription,
        language: subject.language,
      },
    ],
    topical: subject.topical,
    mostRead: subject.mostRead,
    editorsChoices: editorsChoices,
    latestContent: subject.latestContent,
    goTo: subject.goTo,
  };
};
