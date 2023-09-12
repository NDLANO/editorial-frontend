/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from 'slate';
import {
  ISubjectPageData,
  INewSubjectFrontPageData,
  IUpdatedSubjectFrontPageData,
} from '@ndla/types-backend/frontpage-api';
import { ILearningPathV2 } from '@ndla/types-backend/learningpath-api';
import { IArticle } from '@ndla/types-backend/draft-api';
import { ImageEmbedData } from '@ndla/types-embed';
import { BrightcoveEmbed } from '../interfaces';
import {
  editorValueToEmbed,
  editorValueToPlainText,
  plainTextToEditorValue,
} from './articleContentConverter';
import { convertVisualElement } from './ndlaFilmHelpers';

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
  desktopBannerId?: number;
  mobileBannerId?: number;
  editorsChoices: (ILearningPathV2 | IArticle)[];
  language: string;
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
  const visualElement = editorValueToEmbed(values.visualElement)! as
    | ImageEmbedData
    | BrightcoveEmbed;
  const alt = visualElement.resource === 'image' ? visualElement.alt : visualElement.caption;
  const id = visualElement.resource === 'image' ? visualElement.resourceId : visualElement.videoid;
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
      mobileImageId: values.mobileBannerId,
      desktopImageId: values.desktopBannerId!,
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
  editorsChoices?: (ILearningPathV2 | IArticle)[],
): SubjectPageFormikType => {
  const visualElement = subjectpage?.about?.visualElement;

  const embed = visualElement
    ? convertVisualElement({ ...visualElement, alt: visualElement.alt ?? '' })
    : undefined;
  return {
    articleType: elementId.includes('subject') ? 'subjectpage' : 'programme',
    supportedLanguages: subjectpage?.supportedLanguages ?? [],
    language: selectedLanguage,
    description: plainTextToEditorValue(subjectpage?.about?.description ?? ''),
    title: plainTextToEditorValue(subjectpage?.about?.title ?? ''),
    mobileBannerId: subjectpage?.banner.mobileId || subjectpage?.banner.desktopId,
    desktopBannerId: subjectpage?.banner.desktopId,
    visualElement: embed ?? [],
    editorsChoices: editorsChoices ?? [],
    facebook: subjectpage?.facebook,
    goTo: subjectpage?.goTo ?? [],
    id: subjectpage?.id,
    latestContent: subjectpage?.latestContent,
    layout: subjectpage?.layout ?? 'single',
    metaDescription: plainTextToEditorValue(subjectpage?.metaDescription || ''),
    mostRead: subjectpage?.mostRead ?? [],
    name: subjectpage?.about?.title ?? elementName ?? '',
    topical: subjectpage?.topical ?? '',
    twitter: subjectpage?.twitter ?? '',
    elementId,
  };
};
