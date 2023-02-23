import { Element } from 'slate';
import {
  ArrowExpand,
  Camera,
  Code,
  Concept,
  FactBoxMaterial,
  Framed,
  Link as LinkIcon,
  PlayBoxOutline,
  PresentationPlay,
  RelatedArticle,
  TableMaterial,
} from '@ndla/icons/editor';
import { Download, Podcast, VolumeUp } from '@ndla/icons/common';
import { List } from '@ndla/icons/action';
import HowToHelper from '../../../HowTo/HowToHelper';
import { TYPE_CONCEPT_BLOCK } from '../concept/block/types';
import { DRAFT_ADMIN_SCOPE } from '../../../../constants';

const renderArticleInModal = (pageId: string) => <HowToHelper pageId={pageId} extraIconPadding />;

export interface ActionData {
  type: Element['type'] | 'h5p';
  object: string;
}

export interface Action {
  data: ActionData;
  icon: JSX.Element;
  helpIcon: JSX.Element;
  requiredScope?: string;
}

const actions: Action[] = [
  {
    data: { type: 'aside', object: 'factAside' },
    icon: <FactBoxMaterial />,
    helpIcon: renderArticleInModal('FactASide'),
  },
  {
    data: { type: 'details', object: 'details' },
    icon: <ArrowExpand />,
    helpIcon: renderArticleInModal('Details'),
  },
  {
    data: { type: 'table', object: 'table' },
    icon: <TableMaterial />,
    helpIcon: renderArticleInModal('Table'),
  },
  {
    data: { type: 'bodybox', object: 'bodybox' },
    icon: <Framed />,
    helpIcon: renderArticleInModal('BodyBox'),
  },
  {
    data: { type: 'ndlaembed', object: 'image' },
    icon: <Camera />,
    helpIcon: renderArticleInModal('Images'),
  },
  {
    data: { type: 'ndlaembed', object: 'video' },
    icon: <PlayBoxOutline />,
    helpIcon: renderArticleInModal('Videos'),
  },
  {
    data: { type: 'ndlaembed', object: 'audio' },
    icon: <VolumeUp />,
    helpIcon: renderArticleInModal('Audios'),
  },
  {
    data: { type: 'ndlaembed', object: 'podcast' },
    icon: <Podcast />,
    helpIcon: renderArticleInModal('Podcasts'),
  },
  {
    data: { type: 'h5p', object: 'h5p' },
    icon: <PresentationPlay />,
    helpIcon: renderArticleInModal('H5P'),
  },
  {
    data: { type: 'ndlaembed', object: 'url' },
    icon: <LinkIcon />,
    helpIcon: renderArticleInModal('ResourceFromLink'),
  },
  {
    data: { type: 'file', object: 'file' },
    icon: <Download />,
    helpIcon: renderArticleInModal('File'),
  },
  {
    data: { type: 'related', object: 'related' },
    icon: <RelatedArticle />,
    helpIcon: renderArticleInModal('RelatedArticle'),
  },
  {
    data: { type: 'code-block', object: 'code' },
    icon: <Code />,
    helpIcon: renderArticleInModal('CodeBlock'),
  },
  {
    data: { type: TYPE_CONCEPT_BLOCK, object: 'concept' },
    icon: <Concept />,
    helpIcon: renderArticleInModal('Concept'),
  },
  {
    data: { type: 'concept-list', object: 'conceptList' },
    icon: <List />,
    helpIcon: renderArticleInModal('ConceptList'),
    requiredScope: DRAFT_ADMIN_SCOPE,
  },
];

export default actions;
