import { Descendant } from 'slate';
import {
  ISubjectPageData,
  INewSubjectFrontPageData,
  IUpdatedSubjectFrontPageData,
} from '@ndla/types-frontpage-api';
import { BrightcoveEmbed, ImageEmbed } from '../interfaces';
import { DraftApiType } from '../modules/draft/draftApiInterfaces';
import { ImageApiType } from '../modules/image/imageApiInterfaces';
import { Learningpath } from '../modules/learningpath/learningpathApiInterfaces';
import {
  editorValueToEmbed,
  editorValueToPlainText,
  plainTextToEditorValue,
} from './articleContentConverter';
import { convertVisualElement } from './ndlaFilmHelpers';
import { imageToVisualElement } from './visualElementHelper';

export const getIdFromUrn = (urnId: string | undefined) => urnId?.replace('urn:frontpage:', '');

export const getUrnFromId = (id?: number | string): string | undefined =>
  id ? `urn:frontpage:${id}` : undefined;

export interface SubjectPageFormikType {
  facebook?: string;
  goTo: string[];
  id?: number;
  latestContent?: string[];
  layout: string;
  mostRead?: string[];
  name: string;
  topical?: string;
  twitter?: string;
  supportedLanguages?: string[];
  visualElement: Descendant[];
  articleType: string;
  description?: Descendant[];
  metaDescription?: Descendant[];
  desktopBanner?: ImageEmbed;
  editorsChoices: (Learningpath | DraftApiType)[];
  language: string;
  mobileBanner?: number;
  elementId: string;
  title: Descendant[];
}

export const subjectpageFormikTypeToPatchType = (
  values: SubjectPageFormikType,
  editorsChoicesUrns?: string[],
): IUpdatedSubjectFrontPageData => {
  return subjectpageFormikTypeToPostType(values, editorsChoicesUrns);
};

export const subjectpageFormikTypeToPostType = (
  values: SubjectPageFormikType,
  editorsChoicesUrns?: string[],
): INewSubjectFrontPageData => {
  const visualElement = editorValueToEmbed(values.visualElement)! as ImageEmbed | BrightcoveEmbed;
  const alt = visualElement.resource === 'image' ? visualElement.alt : visualElement.caption;
  const id = visualElement.resource === 'image' ? visualElement.resource_id : visualElement.videoid;
  return {
    about: [
      {
        title: editorValueToPlainText(values.title),
        description: values.description ? editorValueToPlainText(values.description) : '',
        language: values.language,
        visualElement: {
          type: visualElement?.resource,
          id,
          alt,
        },
      },
    ],
    banner: {
      mobileImageId: values.mobileBanner,
      desktopImageId: parseInt(values.desktopBanner!.resource_id),
    },
    editorsChoices: editorsChoicesUrns,
    facebook: values.facebook,
    goTo: values.goTo,
    latestContent: values.latestContent,
    layout: values.layout,
    metaDescription: [
      {
        metaDescription: values.metaDescription
          ? editorValueToPlainText(values.metaDescription)
          : '',
        language: values.language,
      },
    ],
    mostRead: values.mostRead,
    name: values.name,
    topical: values.topical,
    twitter: values.twitter,
  };
};

export const subjectpageApiTypeToFormikType = (
  subjectpage: ISubjectPageData | undefined,
  elementName: string | undefined,
  elementId: string,
  selectedLanguage: string,
  editorsChoices?: (Learningpath | DraftApiType)[],
  banner?: ImageApiType, // maybe undefined?
): SubjectPageFormikType => {
  const visualElement = subjectpage?.about?.visualElement;
  const desktopBanner = banner ? imageToVisualElement(banner) : undefined;

  const embed = visualElement
    ? convertVisualElement({ ...visualElement, alt: visualElement.alt ?? '' })
    : undefined;
  return {
    articleType: elementId.includes('subject') ? 'subjectpage' : 'filter',
    supportedLanguages: subjectpage?.supportedLanguages ?? [],
    language: selectedLanguage,
    description: plainTextToEditorValue(subjectpage?.about?.description ?? ''),
    title: plainTextToEditorValue(subjectpage?.about?.title ?? ''),
    mobileBanner: subjectpage?.banner?.mobileId,
    desktopBanner,
    visualElement: embed ?? [],
    editorsChoices: editorsChoices ?? [],
    facebook: subjectpage?.facebook,
    goTo: subjectpage?.goTo ?? [],
    id: subjectpage?.id,
    latestContent: subjectpage?.latestContent,
    layout: subjectpage?.layout ?? 'single',
    metaDescription: plainTextToEditorValue(subjectpage?.metaDescription || ''),
    mostRead: subjectpage?.mostRead ?? [],
    name: subjectpage?.name ?? elementName ?? '',
    topical: subjectpage?.topical ?? '',
    twitter: subjectpage?.twitter ?? '',
    elementId,
  };
};
