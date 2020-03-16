import { Element } from 'slate';

export const defaultBlock: Element = {
  type: 'paragraph',
  data: {},
  children: [
    {
      object: 'text',
      text: '',
      marks: [],
    },
  ],
};

export const defaultBlockWithText = (text: string): Element => ({
  data: {},
  children: [
    {
      object: 'text',
      text,
      marks: [],
    },
  ],
  type: 'paragraph',
});

export const defaultAsideBlock = (type: string): Element =>
  ({
    data: { type },
    type: 'aside',
    children: [defaultBlock],
  });

// TODO assign parameter type
export const defaultEmbedBlock = (data: any): Element =>
  ({
    type: 'embed',
    data,
    children: [],
  });

export const defaultFilesBlock = (data: any): Element => 
  ({
    object: 'Block',
    type: 'file',
    data,
    children: [],
  });

export const defaultRelatedBlock = (): Element =>
  ({
    object: 'block',
    type: 'related',
    data: {},
    children: [],
  });

export default {
  defaultBlock,
  defaultBlockWithText,
  defaultAsideBlock,
  defaultEmbedBlock,
  defaultFilesBlock,
  defaultRelatedBlock,
};
