import {
  ArticleType,
  SubjectpageApiType,
  SubjectpageEditType,
  VisualElement,
} from '../interfaces';

export const getIdFromUrn = (urnId: string | undefined) =>
  urnId?.replace('urn:frontpage:', '');

export const getUrnFromId = (id: number) => `urn:frontpage:${id}`;

export const transformSubjectpageFromApiVersion = (
  subjectpage: SubjectpageApiType,
  elementId: string,
  selectedLanguage: string,
  editorsChoices: ArticleType[],
  banner: VisualElement,
) => {
  const visualElementVideoId = subjectpage.about.visualElement.url
    .split('videoId=')
    .pop();
  const visualElementImageId = subjectpage.about.visualElement.url
    .split('/')
    .pop();

  const subjectpageEditType: SubjectpageEditType = {
    id: subjectpage.id,
    filters: subjectpage.filters,
    layout: subjectpage.layout,
    twitter: subjectpage.twitter,
    facebook: subjectpage.facebook,
    mobileBanner: subjectpage.banner.mobileId,
    desktopBanner: banner,
    name: subjectpage.name,
    description: subjectpage.about.description,
    title: subjectpage.about.title,
    visualElement: {
      url: subjectpage.about.visualElement?.url,
      resource: subjectpage.about.visualElement?.type,
      resource_id: visualElementImageId || '',
      videoid: visualElementVideoId || '',
    },
    visualElementAlt: subjectpage.about.visualElement?.alt,
    metaDescription: subjectpage.metaDescription,
    topical: subjectpage.topical,
    mostRead: subjectpage.mostRead,
    latestContent: subjectpage.latestContent,
    goTo: subjectpage.goTo,
    language: selectedLanguage,
    editorsChoices: editorsChoices,
    elementId: elementId,
    supportedLanguages: subjectpage.supportedLanguages,
  };
  return subjectpageEditType;
};

export const transformSubjectpageToApiVersion = (
  subjectpage: SubjectpageEditType,
  editorsChoices: string[],
) => {
  const id =
    subjectpage.visualElement?.resource === 'image'
      ? subjectpage.visualElement?.resource_id
      : subjectpage.visualElement?.videoid;
  return {
    name: subjectpage.name,
    filters: subjectpage.filters,
    layout: subjectpage.layout,
    twitter: subjectpage.twitter,
    facebook: subjectpage.facebook,
    banner: {
      mobileImageId: subjectpage.mobileBanner,
      desktopImageId: parseInt(subjectpage.desktopBanner!.resource_id),
    },
    about: [
      {
        title: subjectpage.title,
        description: subjectpage.description,
        language: subjectpage.language,
        visualElement: {
          type: subjectpage.visualElement?.resource,
          id: id,
          alt: subjectpage.visualElementAlt,
        },
      },
    ],
    metaDescription: [
      {
        metaDescription: subjectpage.metaDescription,
        language: subjectpage.language,
      },
    ],
    topical: subjectpage.topical,
    mostRead: subjectpage.mostRead,
    editorsChoices: editorsChoices,
    latestContent: subjectpage.latestContent,
    goTo: subjectpage.goTo,
  };
};
