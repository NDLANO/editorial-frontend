import React from 'react';
import {
  Quote,
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

const actions = [
  {
    data: { type: 'block', object: 'block' },
    icon: <Quote />,
  },
  {
    data: { type: 'aside', object: 'factAside' },
    icon: <FactBoxMaterial />,
  },
  {
    data: { type: 'table', object: 'table' },
    icon: <TableMaterial />,
  },
  {
    data: { type: 'bodybox', object: 'bodybox' },
    icon: <Framed />,
  },
  {
    data: { type: 'details', object: 'details' },
    icon: <ArrowExpand />,
  },
  {
    data: { type: 'embed', object: 'image' },
    icon: <Camera />,
  },
  {
    data: { type: 'embed', object: 'video' },
    icon: <PlayBoxOutline />,
  },
  {
    data: { type: 'embed', object: 'audio' },
    icon: <Quote />,
  },
  {
    data: { type: 'embed', object: 'h5p' },
    icon: <PresentationPlay />,
  },
  {
    data: { type: 'embed', object: 'url' },
    icon: <LinkIcon />,
  },
  {
    data: { type: 'related', object: 'related' },
    icon: <RelatedArticle />,
  },
];

export default actions;
