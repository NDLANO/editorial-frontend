import { NewSubjectFrontPageData } from '../modules/frontpage/frontpageApiInterfaces';
import { ArticleType, SubjectpageApiType, SubjectpageEditType, VisualElement } from '../interfaces';

export const getIdFromUrn = (urnId: string | undefined) => urnId?.replace('urn:frontpage:', '');

export const getUrnFromId = (id?: number | string): string | undefined =>
  id ? `urn:frontpage:${id}` : undefined;

export const transformSubjectpageFromApiVersion = (
  subjectpage: SubjectpageApiType,
  elementId: string,
  selectedLanguage: string,
  editorsChoices: ArticleType[],
  banner: VisualElement,
) => {
  const visualElementVideoId = subjectpage.about.visualElement.url.split('videoId=')?.[1];
  const visualElementImageId = subjectpage.about.visualElement.url.split('/').pop();

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
    visualElementObject: {
      url: subjectpage.about.visualElement?.url,
      resource: subjectpage.about.visualElement?.type,
      resource_id: visualElementImageId || '',
      videoid: visualElementVideoId || '',
      ...(visualElementVideoId
        ? { caption: subjectpage.about.visualElement.alt }
        : { alt: subjectpage.about.visualElement.alt }),
      alt: subjectpage.about.visualElement.alt,
    },
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
): NewSubjectFrontPageData | null => {
  const id =
    subjectpage.visualElementObject?.resource === 'image'
      ? subjectpage.visualElementObject?.resource_id
      : subjectpage.visualElementObject?.videoid;

  if (
    subjectpage.layout === undefined ||
    subjectpage.title === undefined ||
    subjectpage.description === undefined ||
    subjectpage.visualElementObject?.resource === undefined ||
    subjectpage.metaDescription === undefined ||
    id === undefined
  ) {
    return null;
  }

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
          type: subjectpage.visualElementObject?.resource,
          id: id,
          alt: subjectpage.visualElementObject?.alt || subjectpage.visualElementObject?.caption,
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
