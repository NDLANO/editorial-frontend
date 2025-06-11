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
  AlertLine,
  BroadcastLine,
  CameraFill,
  CodeView,
  DownloadLine,
  ExpandDiagonalLine,
  FileListFill,
  GlobalLine,
  LayoutColumnLine,
  LineChartLine,
  LinkMedium,
  MegaphoneLine,
  MessageLine,
  MovieLine,
  OrganizationChart,
  SlideshowLine,
  SquareLine,
  StickyNoteAddLine,
  TableLine,
  UserFill,
  VolumeUpFill,
} from "@ndla/icons";
import { ASIDE_ELEMENT_TYPE } from "../aside/asideTypes";
import { AUDIO_ELEMENT_TYPE } from "../audio/audioTypes";
import { CAMPAIGN_BLOCK_ELEMENT_TYPE } from "../campaignBlock/types";
import { CODE_BLOCK_ELEMENT_TYPE } from "../codeBlock/types";
import { COMMENT_BLOCK_ELEMENT_TYPE } from "../comment/block/types";
import { GLOSS_BLOCK_ELEMENT_TYPE } from "../concept/block/types";
import { CONTACT_BLOCK_ELEMENT_TYPE } from "../contactBlock/types";
import { DETAILS_ELEMENT_TYPE } from "../details/detailsTypes";
import { EXTERNAL_ELEMENT_TYPE } from "../external/types";
import { FILE_ELEMENT_TYPE } from "../file/types";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../framedContent/framedContentTypes";
import { GRID_ELEMENT_TYPE } from "../grid/types";
import { H5P_ELEMENT_TYPE } from "../h5p/types";
import { IMAGE_ELEMENT_TYPE } from "../image/types";
import { KEY_FIGURE_ELEMENT_TYPE } from "../keyFigure/types";
import { LINK_BLOCK_LIST_ELEMENT_TYPE } from "../linkBlockList/types";
import { PITCH_ELEMENT_TYPE } from "../pitch/types";
import { RELATED_ELEMENT_TYPE } from "../related/types";
import { TABLE_ELEMENT_TYPE } from "../table/types";
import { DISCLAIMER_ELEMENT_TYPE } from "../uuDisclaimer/types";
import { BRIGHTCOVE_ELEMENT_TYPE } from "../video/types";

export interface ActionData {
  type: Element["type"];
  object: string;
}

export interface Action {
  data: ActionData;
  icon: JSX.Element;
  bookmark?: string;
}

export const commonActions: Action[] = [
  {
    data: { type: ASIDE_ELEMENT_TYPE, object: "factAside" },
    icon: <FileListFill />,
    bookmark: "#bkmrk-faktaboks",
  },
  {
    data: { type: DETAILS_ELEMENT_TYPE, object: "details" },
    icon: <ExpandDiagonalLine />,
    bookmark: "#bkmrk-ekspanderende-boks",
  },
  {
    data: { type: TABLE_ELEMENT_TYPE, object: "table" },
    icon: <TableLine />,
    bookmark: "#bkmrk-tabell",
  },
  {
    data: { type: FRAMED_CONTENT_ELEMENT_TYPE, object: "framedContent" },
    icon: <SquareLine />,
    bookmark: "#bkmrk-tekst-i-ramme",
  },
  {
    data: { type: IMAGE_ELEMENT_TYPE, object: "image" },
    icon: <CameraFill />,
    bookmark: "#bkmrk-bilde",
  },
  {
    data: { type: BRIGHTCOVE_ELEMENT_TYPE, object: "video" },
    icon: <MovieLine />,
    bookmark: "#bkmrk-video",
  },
  {
    data: { type: AUDIO_ELEMENT_TYPE, object: "audio" },
    icon: <VolumeUpFill />,
    bookmark: "#bkmrk-lyd",
  },
  {
    data: { type: AUDIO_ELEMENT_TYPE, object: "podcast" },
    icon: <BroadcastLine />,
    bookmark: "#bkmrk-podkastepisode",
  },
  {
    data: { type: H5P_ELEMENT_TYPE, object: "h5p" },
    icon: <SlideshowLine />,
    bookmark: "#bkmrk-h5p",
  },
  {
    data: { type: EXTERNAL_ELEMENT_TYPE, object: "url" },
    icon: <LinkMedium />,
    bookmark: "#bkmrk-ressurs-fra-lenke",
  },
  {
    data: { type: FILE_ELEMENT_TYPE, object: "file" },
    icon: <DownloadLine />,
    bookmark: "#bkmrk-fil",
  },
  {
    data: { type: RELATED_ELEMENT_TYPE, object: "related" },
    icon: <OrganizationChart />,
    bookmark: "#bkmrk-relatert-innhold",
  },
  {
    data: { type: CODE_BLOCK_ELEMENT_TYPE, object: "code" },
    icon: <CodeView />,
    bookmark: "#bkmrk-kodevisning",
  },
  {
    data: { type: GLOSS_BLOCK_ELEMENT_TYPE, object: "gloss" },
    icon: <GlobalLine />,
    bookmark: "#bkmrk-glose",
  },
  {
    data: { type: DISCLAIMER_ELEMENT_TYPE, object: "disclaimer" },
    icon: <AlertLine />,
    bookmark: "#bkmrk-kommentar",
  },
  {
    data: { type: COMMENT_BLOCK_ELEMENT_TYPE, object: "comment" },
    icon: <MessageLine />,
    bookmark: "#bkmrk-kommentar-1",
  },
];

export const frontpageActions = commonActions.concat(
  {
    data: { type: GRID_ELEMENT_TYPE, object: "grid" },
    icon: <LayoutColumnLine />,
    bookmark: "#bkmrk-grid",
  },
  {
    data: { type: PITCH_ELEMENT_TYPE, object: "pitch" },
    icon: <StickyNoteAddLine />,
  },
  {
    data: { type: KEY_FIGURE_ELEMENT_TYPE, object: "keyFigure" },
    icon: <LineChartLine />,
  },
  {
    data: { type: CONTACT_BLOCK_ELEMENT_TYPE, object: "contactBlock" },
    icon: <UserFill />,
  },
  {
    data: { type: CAMPAIGN_BLOCK_ELEMENT_TYPE, object: "campaignBlock" },
    icon: <MegaphoneLine />,
  },
  {
    data: { type: LINK_BLOCK_LIST_ELEMENT_TYPE, object: "linkBlockList" },
    icon: <LinkMedium />,
  },
);

export const learningResourceActions = commonActions.concat({
  data: { type: GRID_ELEMENT_TYPE, object: "grid" },
  icon: <LayoutColumnLine />,
  bookmark: "#bkmrk-grid",
});
