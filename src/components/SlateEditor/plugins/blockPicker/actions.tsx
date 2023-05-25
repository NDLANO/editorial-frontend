import { Element } from 'slate';
import {
  ArrowExpand,
  Camera,
  Code,
  Concept,
  FactBoxMaterial,
  Framed,
  Grid,
  Link as LinkIcon,
  PlayBoxOutline,
  PresentationPlay,
  RelatedArticle,
  TableMaterial,
} from '@ndla/icons/editor';
import { Download, HelpCircle, Podcast, VolumeUp } from '@ndla/icons/common';
import { List } from '@ndla/icons/action';
import HowToHelper from '../../../HowTo/HowToHelper';
import { TYPE_CONCEPT_BLOCK } from '../concept/block/types';
import { DRAFT_ADMIN_SCOPE } from '../../../../constants';
import {
  TYPE_EMBED_AUDIO,
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_H5P,
  TYPE_EMBED_IMAGE,
} from '../embed/types';
import { TYPE_ASIDE } from '../aside/types';
import { TYPE_DETAILS } from '../details/types';
import { TYPE_TABLE } from '../table/types';
import { TYPE_BODYBOX } from '../bodybox/types';
import { TYPE_FILE } from '../file/types';
import { TYPE_RELATED } from '../related/types';
import { TYPE_CODEBLOCK } from '../codeBlock/types';
import { TYPE_CONCEPT_LIST } from '../conceptList/types';
import { TYPE_BLOGPOST } from '../blogPost/types';
import { TYPE_GRID } from '../grid/types';

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
    helpIcon: renderArticleInModal('FactASide'),
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
    data: { type: TYPE_BODYBOX, object: 'bodybox' },
    icon: <Framed />,
    helpIcon: renderArticleInModal('BodyBox'),
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
    data: { type: TYPE_EMBED_AUDIO, object: 'audio' },
    icon: <VolumeUp />,
    helpIcon: renderArticleInModal('Audios'),
  },
  {
    data: { type: TYPE_EMBED_AUDIO, object: 'podcast' },
    icon: <Podcast />,
    helpIcon: renderArticleInModal('Podcasts'),
  },
  {
    data: { type: TYPE_EMBED_H5P, object: 'h5p' },
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
    data: { type: TYPE_GRID, object: 'grid' },
    icon: <Grid />,
    helpIcon: renderArticleInModal('Grid'),
  },
];

export const frontpageActions = commonActions.concat({
  data: { type: TYPE_BLOGPOST, object: 'blogPost' },
  icon: <HelpCircle />,
  helpIcon: renderArticleInModal('BlogPost'),
});
