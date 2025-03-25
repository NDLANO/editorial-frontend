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
import { TYPE_CONTACT_BLOCK } from "../contactBlock/types";
import { TYPE_DETAILS } from "../details/types";
import { TYPE_EXTERNAL } from "../external/types";
import { TYPE_FILE } from "../file/types";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../framedContent/framedContentTypes";
import { TYPE_GRID } from "../grid/types";
import { TYPE_H5P } from "../h5p/types";
import { TYPE_IMAGE } from "../image/types";
import { TYPE_KEY_FIGURE } from "../keyFigure/types";
import { TYPE_LINK_BLOCK_LIST } from "../linkBlockList/types";
import { TYPE_PITCH } from "../pitch/types";
import { TYPE_RELATED } from "../related/types";
import { TYPE_TABLE } from "../table/types";
import { TYPE_DISCLAIMER } from "../uuDisclaimer/types";
import { TYPE_EMBED_BRIGHTCOVE } from "../video/types";

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
    data: { type: TYPE_DETAILS, object: "details" },
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
    data: { type: TYPE_EMBED_BRIGHTCOVE, object: "video" },
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
    data: { type: TYPE_H5P, object: "h5p" },
    icon: <SlideshowLine />,
    helpIcon: renderArticleInDialog("H5P"),
  },
  {
    data: { type: TYPE_EXTERNAL, object: "url" },
    icon: <LinkMedium />,
    helpIcon: renderArticleInDialog("ResourceFromLink"),
  },
  {
    data: { type: TYPE_FILE, object: "file" },
    icon: <DownloadLine />,
    helpIcon: renderArticleInDialog("File"),
  },
  {
    data: { type: TYPE_RELATED, object: "related" },
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
    data: { type: TYPE_DISCLAIMER, object: "disclaimer" },
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
    data: { type: TYPE_PITCH, object: "pitch" },
    icon: <StickyNoteAddLine />,
    helpIcon: renderArticleInDialog("Pitch"),
  },
  {
    data: { type: TYPE_KEY_FIGURE, object: "keyFigure" },
    icon: <LineChartLine />,
    helpIcon: renderArticleInDialog("KeyFigure"),
  },
  {
    data: { type: TYPE_CONTACT_BLOCK, object: "contactBlock" },
    icon: <UserFill />,
    helpIcon: renderArticleInDialog("ContactBlock"),
  },
  {
    data: { type: CAMPAIGN_BLOCK_ELEMENT_TYPE, object: "campaignBlock" },
    icon: <MegaphoneLine />,
    helpIcon: renderArticleInDialog("CampaignBlock"),
  },
  {
    data: { type: TYPE_LINK_BLOCK_LIST, object: "linkBlockList" },
    icon: <LinkMedium />,
    helpIcon: renderArticleInDialog("LinkBlockList"),
  },
);

export const learningResourceActions = commonActions.concat({
  data: { type: TYPE_GRID, object: "grid" },
  icon: <LayoutColumnLine />,
  helpIcon: renderArticleInDialog("Grid"),
});
