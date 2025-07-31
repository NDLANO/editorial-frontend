/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { ISubjectPageDTO, INewSubjectPageDTO, IUpdatedSubjectPageDTO } from "@ndla/types-backend/frontpage-api";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { BrightcoveEmbedData, ImageEmbedData } from "@ndla/types-embed";
import { editorValueToEmbed, editorValueToPlainText, plainTextToEditorValue } from "./articleContentConverter";
import { convertVisualElement } from "./convertVisualElement";

export const getIdFromUrn = (urnId: string | undefined) => urnId?.replace("urn:frontpage:", "");

export const getUrnFromId = (id?: number | string): string | undefined => (id ? `urn:frontpage:${id}` : undefined);

export interface SubjectPageFormikType {
  id?: number;
  name: string;
  supportedLanguages?: string[];
  visualElement: Descendant[];
  articleType: string;
  description?: Descendant[];
  metaDescription?: Descendant[];
  desktopBannerId?: number;
  mobileBannerId?: number;
  editorsChoices: (ILearningPathV2DTO | IArticleDTO)[];
  language: string;
  elementId: string;
  title: Descendant[];
  connectedTo: string[];
  buildsOn: string[];
  leadsTo: string[];
}

export const subjectpageFormikTypeToPatchType = (
  values: SubjectPageFormikType,
  editorsChoicesUrns?: string[],
): IUpdatedSubjectPageDTO => {
  return subjectpageFormikTypeToPostType(values, editorsChoicesUrns);
};

export const subjectpageFormikTypeToPostType = (
  values: SubjectPageFormikType,
  editorsChoicesUrns?: string[],
): INewSubjectPageDTO => {
  const visualElement = editorValueToEmbed(values.visualElement)! as ImageEmbedData | BrightcoveEmbedData;
  const alt = visualElement.resource === "image" ? visualElement.alt : visualElement.caption;
  const id = visualElement.resource === "image" ? visualElement.resourceId : visualElement.videoid;
  return {
    about: [
      {
        title: editorValueToPlainText(values.title),
        description: values.description ? editorValueToPlainText(values.description) : "",
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
    metaDescription: [
      {
        metaDescription: values.metaDescription ? editorValueToPlainText(values.metaDescription) : "",
        language: values.language,
      },
    ],
    name: values.name,
    connectedTo: values.connectedTo,
    buildsOn: values.buildsOn,
    leadsTo: values.leadsTo,
  };
};

export const subjectpageApiTypeToFormikType = (
  subjectpage: ISubjectPageDTO | undefined,
  elementName: string | undefined,
  elementId: string,
  selectedLanguage: string,
  editorsChoices?: (ILearningPathV2DTO | IArticleDTO)[],
): SubjectPageFormikType => {
  const visualElement = subjectpage?.about?.visualElement;

  const embed = visualElement ? convertVisualElement({ ...visualElement, alt: visualElement.alt ?? "" }) : undefined;
  return {
    articleType: elementId.includes("subject") ? "subjectpage" : "programme",
    supportedLanguages: subjectpage?.supportedLanguages ?? [],
    language: selectedLanguage,
    description: plainTextToEditorValue(subjectpage?.about?.description ?? ""),
    title: plainTextToEditorValue(subjectpage?.about?.title ?? ""),
    mobileBannerId: subjectpage?.banner.mobileId || subjectpage?.banner.desktopId,
    desktopBannerId: subjectpage?.banner.desktopId,
    visualElement: embed ?? [],
    editorsChoices: editorsChoices ?? [],
    id: subjectpage?.id,
    metaDescription: plainTextToEditorValue(subjectpage?.metaDescription || ""),
    name: subjectpage?.about?.title ?? elementName ?? "",
    elementId,
    connectedTo: subjectpage?.connectedTo ?? [],
    buildsOn: subjectpage?.buildsOn ?? [],
    leadsTo: subjectpage?.leadsTo ?? [],
  };
};
