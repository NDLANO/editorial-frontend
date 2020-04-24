import React from 'react';
import {
  Camera,
  FactBoxMaterial,
  Link as LinkIcon,
  TableMaterial,
  ArrowExpand,
  Framed,
  PlayBoxOutline,
  PresentationPlay,
  RelatedArticle,
} from '@ndla/icons/editor';
import { Download, VolumeUp } from '@ndla/icons/common';
import HowToHelper from '../../../HowTo/HowToHelper';

const renderArticleInModal = pageId => (
  <HowToHelper pageId={pageId} extraIconPadding />
);

const actions = [
  {
    data: { type: 'aside', object: 'factAside' },
    icon: <FactBoxMaterial />,
    helpIcon: renderArticleInModal('FactASide'),
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
    data: { type: 'details', object: 'details' },
    icon: <ArrowExpand />,
    helpIcon: renderArticleInModal('Details'),
  },
  {
    data: { type: 'embed', object: 'image' },
    icon: <Camera />,
    helpIcon: renderArticleInModal('Images'),
  },
  {
    data: { type: 'embed', object: 'video' },
    icon: <PlayBoxOutline />,
    helpIcon: renderArticleInModal('Videos'),
  },
  {
    data: { type: 'embed', object: 'audio' },
    icon: <VolumeUp />,
    helpIcon: renderArticleInModal('Audios'),
  },
  {
    data: { type: 'embed', object: 'h5p' },
    icon: <PresentationPlay />,
    helpIcon: renderArticleInModal('H5P'),
  },
  {
    data: { type: 'embed', object: 'url' },
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
];

export default actions;
