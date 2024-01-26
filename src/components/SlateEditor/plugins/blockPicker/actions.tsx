/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Element } from 'slate';
import { List } from '@ndla/icons/action';
import {
  Announcement,
  Download,
  Insights,
  Link,
  Person,
  Podcast,
  VolumeUp,
  WarningOutline,
} from '@ndla/icons/common';
import {
  ArrowExpand,
  BlogPost,
  Camera,
  Code,
  Concept,
  FactBoxMaterial,
  Framed,
  Globe,
  Grid,
  Link as LinkIcon,
  PlayBoxOutline,
  PresentationPlay,
  RelatedArticle,
  TableMaterial,
} from '@ndla/icons/editor';
import { DRAFT_ADMIN_SCOPE } from '../../../../constants';
import HowToHelper from '../../../HowTo/HowToHelper';
import { TYPE_ASIDE } from '../aside/types';
import { TYPE_AUDIO } from '../audio/types';
import { TYPE_BLOGPOST } from '../blogPost/types';
import { TYPE_CAMPAIGN_BLOCK } from '../campaignBlock/types';
import { TYPE_CODEBLOCK } from '../codeBlock/types';
import { TYPE_CONCEPT_BLOCK, TYPE_GLOSS_BLOCK } from '../concept/block/types';
import { TYPE_CONCEPT_LIST } from '../conceptList/types';
import { TYPE_CONTACT_BLOCK } from '../contactBlock/types';
import { TYPE_DETAILS } from '../details/types';
import { TYPE_EMBED_BRIGHTCOVE, TYPE_EMBED_EXTERNAL, TYPE_EMBED_IMAGE } from '../embed/types';
import { TYPE_FILE } from '../file/types';
import { TYPE_FRAMED_CONTENT } from '../framedContent/types';
import { TYPE_GRID } from '../grid/types';
import { TYPE_H5P } from '../h5p/types';
import { TYPE_KEY_FIGURE } from '../keyFigure/types';
import { TYPE_LINK_BLOCK_LIST } from '../linkBlockList/types';
import { TYPE_RELATED } from '../related/types';
import { TYPE_TABLE } from '../table/types';
import { TYPE_DISCLAIMER } from '../uuDisclaimer/types';

const renderArticleInModal = (pageId: string) => <HowToHelper pageId={pageId} extraIconPadding />;

export interface ActionData {
  type: Element['type'];
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
    data: { type: TYPE_ASIDE, object: 'factAside' },
    icon: <FactBoxMaterial />,
    helpIcon: renderArticleInModal('FactAside'),
  },
  {
    data: { type: TYPE_DETAILS, object: 'details' },
    icon: <ArrowExpand />,
    helpIcon: renderArticleInModal('Details'),
  },
  {
    data: { type: TYPE_TABLE, object: 'table' },
    icon: <TableMaterial />,
    helpIcon: renderArticleInModal('Table'),
  },
  {
    data: { type: TYPE_FRAMED_CONTENT, object: 'framedContent' },
    icon: <Framed />,
    helpIcon: renderArticleInModal('FramedContent'),
  },
  {
    data: { type: TYPE_EMBED_IMAGE, object: 'image' },
    icon: <Camera />,
    helpIcon: renderArticleInModal('Images'),
  },
  {
    data: { type: TYPE_EMBED_BRIGHTCOVE, object: 'video' },
    icon: <PlayBoxOutline />,
    helpIcon: renderArticleInModal('Videos'),
  },
  {
    data: { type: TYPE_AUDIO, object: 'audio' },
    icon: <VolumeUp />,
    helpIcon: renderArticleInModal('Audios'),
  },
  {
    data: { type: TYPE_AUDIO, object: 'podcast' },
    icon: <Podcast />,
    helpIcon: renderArticleInModal('Podcasts'),
  },
  {
    data: { type: TYPE_H5P, object: 'h5p' },
    icon: <PresentationPlay />,
    helpIcon: renderArticleInModal('H5P'),
  },
  {
    data: { type: TYPE_EMBED_EXTERNAL, object: 'url' },
    icon: <LinkIcon />,
    helpIcon: renderArticleInModal('ResourceFromLink'),
  },
  {
    data: { type: TYPE_FILE, object: 'file' },
    icon: <Download />,
    helpIcon: renderArticleInModal('File'),
  },
  {
    data: { type: TYPE_RELATED, object: 'related' },
    icon: <RelatedArticle />,
    helpIcon: renderArticleInModal('RelatedArticle'),
  },
  {
    data: { type: TYPE_CODEBLOCK, object: 'code' },
    icon: <Code />,
    helpIcon: renderArticleInModal('CodeBlock'),
  },
  {
    data: { type: TYPE_CONCEPT_BLOCK, object: 'concept' },
    icon: <Concept />,
    helpIcon: renderArticleInModal('Concept'),
  },
  {
    data: { type: TYPE_CONCEPT_LIST, object: 'conceptList' },
    icon: <List />,
    helpIcon: renderArticleInModal('ConceptList'),
    requiredScope: DRAFT_ADMIN_SCOPE,
  },
  {
    data: { type: TYPE_GLOSS_BLOCK, object: 'gloss' },
    icon: <Globe />,
    helpIcon: renderArticleInModal('Gloss'),
  },
  {
    data: { type: TYPE_DISCLAIMER, object: 'disclaimer' },
    icon: <WarningOutline />,
    helpIcon: renderArticleInModal('Disclaimer'),
  },
];

export const frontpageActions = commonActions.concat(
  {
    data: { type: TYPE_GRID, object: 'grid' },
    icon: <Grid />,
    helpIcon: renderArticleInModal('Grid'),
  },
  {
    data: { type: TYPE_BLOGPOST, object: 'blogPost' },
    icon: <BlogPost />,
    helpIcon: renderArticleInModal('BlogPost'),
  },
  {
    data: { type: TYPE_KEY_FIGURE, object: 'keyFigure' },
    icon: <Insights />,
    helpIcon: renderArticleInModal('KeyFigure'),
  },
  {
    data: { type: TYPE_CONTACT_BLOCK, object: 'contactBlock' },
    icon: <Person />,
    helpIcon: renderArticleInModal('ContactBlock'),
  },
  {
    data: { type: TYPE_CAMPAIGN_BLOCK, object: 'campaignBlock' },
    icon: <Announcement />,
    helpIcon: renderArticleInModal('CampaignBlock'),
  },
  {
    data: { type: TYPE_LINK_BLOCK_LIST, object: 'linkBlockList' },
    icon: <Link />,
    helpIcon: renderArticleInModal('LinkBlockList'),
  },
);

export const learningResourceActions = commonActions.concat({
  data: { type: TYPE_GRID, object: 'grid' },
  icon: <Grid />,
  helpIcon: renderArticleInModal('Grid'),
  requiredScope: DRAFT_ADMIN_SCOPE,
});
