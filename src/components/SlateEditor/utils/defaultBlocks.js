import { Block } from 'slate';

export const defaultBlock = {
  type: 'paragraph',
  data: {},
  nodes: [
    {
      object: 'text',
      text: '',
      marks: [],
    },
  ],
};

export const defaultBlockWithText = text => ({
  data: {},
  nodes: [
    {
      object: 'text',
      text,
      marks: [],
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

export const defaultCodeBlock = () =>
  Block.create({
    object: 'block',
    type: 'code-block',
    data: {},
  });

const defaultBlocks = {
  defaultAsideBlock,
  defaultBlock,
  defaultBlockWithText,
  defaultCodeBlock,
  defaultEmbedBlock,
  defaultFilesBlock,
  defaultRelatedBlock,
};
export default defaultBlocks;
