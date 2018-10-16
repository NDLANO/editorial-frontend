import { Block } from 'slate';

export const defaultBlock = {
  type: 'paragraph',
  data: {},
};

export const defaultBlockWithText = text => ({
  data: {},
  object: 'block',
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

export const defaultRelatedBlock = () =>
  Block.create({
    object: 'block',
    type: 'related',
    data: {},
  });
