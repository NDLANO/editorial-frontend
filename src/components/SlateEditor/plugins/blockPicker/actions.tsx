/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";
import { Element } from "slate";
import {
  LineChartLine,
  BroadcastLine,
  VolumeUpFill,
  AlertLine,
  MessageLine,
  MegaphoneLine,
  DownloadLine,
  UserFill,
  StickyNoteAddLine,
  ExpandDiagonalLine,
  FileListFill,
  SquareLine,
  GlobalLine,
  LayoutColumnLine,
  MovieLine,
  OrganizationChart,
  TableLine,
  CameraFill,
  SlideshowLine,
  LinkMedium,
  CodeView,
} from "@ndla/icons";
import { DRAFT_ADMIN_SCOPE } from "../../../../constants";
import HowToHelper from "../../../HowTo/HowToHelper";
import { StoryType } from "../../../HowTo/stories";
import { ASIDE_ELEMENT_TYPE } from "../aside/asideTypes";
import { AUDIO_ELEMENT_TYPE } from "../audio/audioTypes";
import { CAMPAIGN_BLOCK_ELEMENT_TYPE } from "../campaignBlock/types";
import { CODE_BLOCK_ELEMENT_TYPE } from "../codeBlock/types";
import { COMMENT_BLOCK_ELEMENT_TYPE } from "../comment/block/types";
import { TYPE_GLOSS_BLOCK } from "../concept/block/types";
import { CONTACT_BLOCK_ELEMENT_TYPE } from "../contactBlock/types";
import { DETAILS_ELEMENT_TYPE } from "../details/detailsTypes";
import { TYPE_EXTERNAL } from "../external/types";
import { FILE_ELEMENT_TYPE } from "../file/types";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../framedContent/framedContentTypes";
import { TYPE_GRID } from "../grid/types";
import { H5P_ELEMENT_TYPE } from "../h5p/types";
import { TYPE_IMAGE } from "../image/types";
import { KEY_FIGURE_ELEMENT_TYPE } from "../keyFigure/types";
import { LINK_BLOCK_LIST_ELEMENT_TYPE } from "../linkBlockList/types";
import { PITCH_ELEMENT_TYPE } from "../pitch/types";
import { RELATED_ELEMENT_TYPE } from "../related/types";
import { TYPE_TABLE } from "../table/types";
import { DISCLAIMER_ELEMENT_TYPE } from "../uuDisclaimer/types";
import { BRIGHTCOVE_ELEMENT_TYPE } from "../video/types";

const renderArticleInDialog = (pageId: string) => <HowToHelper pageId={pageId as StoryType} />;

export interface ActionData {
  type: Element["type"];
  object: string;
}

export interface Action {
  data: ActionData;
  icon: JSX.Element;
  helpIcon: JSX.Element;
  requiredScope?: string;
}

export const commonActions: Action[] = [
  {
    data: { type: ASIDE_ELEMENT_TYPE, object: "factAside" },
    icon: <FileListFill />,
    helpIcon: renderArticleInDialog("FactAside"),
  },
  {
    data: { type: DETAILS_ELEMENT_TYPE, object: "details" },
    icon: <ExpandDiagonalLine />,
    helpIcon: renderArticleInDialog("Details"),
  },
  {
    data: { type: TYPE_TABLE, object: "table" },
    icon: <TableLine />,
    helpIcon: renderArticleInDialog("Table"),
  },
  {
    data: { type: FRAMED_CONTENT_ELEMENT_TYPE, object: "framedContent" },
    icon: <SquareLine />,
    helpIcon: renderArticleInDialog("FramedContent"),
  },
  {
    data: { type: TYPE_IMAGE, object: "image" },
    icon: <CameraFill />,
    helpIcon: renderArticleInDialog("Images"),
  },
  {
    data: { type: BRIGHTCOVE_ELEMENT_TYPE, object: "video" },
    icon: <MovieLine />,
    helpIcon: renderArticleInDialog("Videos"),
  },
  {
    data: { type: AUDIO_ELEMENT_TYPE, object: "audio" },
    icon: <VolumeUpFill />,
    helpIcon: renderArticleInDialog("Audios"),
  },
  {
    data: { type: AUDIO_ELEMENT_TYPE, object: "podcast" },
    icon: <BroadcastLine />,
    helpIcon: renderArticleInDialog("Podcasts"),
  },
  {
    data: { type: H5P_ELEMENT_TYPE, object: "h5p" },
    icon: <SlideshowLine />,
    helpIcon: renderArticleInDialog("H5P"),
  },
  {
    data: { type: TYPE_EXTERNAL, object: "url" },
    icon: <LinkMedium />,
    helpIcon: renderArticleInDialog("ResourceFromLink"),
  },
  {
    data: { type: FILE_ELEMENT_TYPE, object: "file" },
    icon: <DownloadLine />,
    helpIcon: renderArticleInDialog("File"),
  },
  {
    data: { type: RELATED_ELEMENT_TYPE, object: "related" },
    icon: <OrganizationChart />,
    helpIcon: renderArticleInDialog("RelatedArticle"),
  },
  {
    data: { type: CODE_BLOCK_ELEMENT_TYPE, object: "code" },
    icon: <CodeView />,
    helpIcon: renderArticleInDialog("CodeBlock"),
  },
  {
    data: { type: TYPE_GLOSS_BLOCK, object: "gloss" },
    icon: <GlobalLine />,
    helpIcon: renderArticleInDialog("Gloss"),
  },
  {
    data: { type: DISCLAIMER_ELEMENT_TYPE, object: "disclaimer" },
    icon: <AlertLine />,
    helpIcon: renderArticleInDialog("Disclaimer"),
    requiredScope: DRAFT_ADMIN_SCOPE,
  },
  {
    data: { type: COMMENT_BLOCK_ELEMENT_TYPE, object: "comment" },
    icon: <MessageLine />,
    helpIcon: renderArticleInDialog("Comment"),
  },
];

export const frontpageActions = commonActions.concat(
  {
    data: { type: TYPE_GRID, object: "grid" },
    icon: <LayoutColumnLine />,
    helpIcon: renderArticleInDialog("Grid"),
  },
  {
    data: { type: PITCH_ELEMENT_TYPE, object: "pitch" },
    icon: <StickyNoteAddLine />,
    helpIcon: renderArticleInDialog("Pitch"),
  },
  {
    data: { type: KEY_FIGURE_ELEMENT_TYPE, object: "keyFigure" },
    icon: <LineChartLine />,
    helpIcon: renderArticleInDialog("KeyFigure"),
  },
  {
    data: { type: CONTACT_BLOCK_ELEMENT_TYPE, object: "contactBlock" },
    icon: <UserFill />,
    helpIcon: renderArticleInDialog("ContactBlock"),
  },
  {
    data: { type: CAMPAIGN_BLOCK_ELEMENT_TYPE, object: "campaignBlock" },
    icon: <MegaphoneLine />,
    helpIcon: renderArticleInDialog("CampaignBlock"),
  },
  {
    data: { type: LINK_BLOCK_LIST_ELEMENT_TYPE, object: "linkBlockList" },
    icon: <LinkMedium />,
    helpIcon: renderArticleInDialog("LinkBlockList"),
  },
);

export const learningResourceActions = commonActions.concat({
  data: { type: TYPE_GRID, object: "grid" },
  icon: <LayoutColumnLine />,
  helpIcon: renderArticleInDialog("Grid"),
});
