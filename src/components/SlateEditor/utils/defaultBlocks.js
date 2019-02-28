import { Block } from 'slate';

export const defaultBlock = {
  type: 'paragraph',
  data: {},
  nodes: [
    {
      object: 'text',
      leaves: [
        {
          object: 'leaf',
          marks: [],
          text: '',
        },
      ],
    },
  ],
};

export const defaultBlockWithText = text => ({
  data: {},
  nodes: [
    {
      object: 'text',
      leaves: [
        {
          object: 'leaf',
          marks: [],
          text,
        },
      ],
    },
  ],
  type: 'paragraph',
});

export const defaultAsideBlock = type =>
  Block.create({
    data: { type },
    type: 'aside',
    nodes: Block.createList([defaultBlock]),
  });

export const defaultEmbedBlock = data =>
  Block.create({
    type: 'embed',
    data,
  });

export const defaultFilesBlock = data => {
  return Block.create({
    object: 'Block',
    type: 'file',
    data,
  });
};

export const defaultRelatedBlock = () =>
  Block.create({
    object: 'block',
    type: 'related',
    data: {},
  });

export default {
  defaultBlock,
  defaultBlockWithText,
  defaultAsideBlock,
  defaultEmbedBlock,
  defaultFilesBlock,
  defaultRelatedBlock,
};
