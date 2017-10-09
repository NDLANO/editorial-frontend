import { Block, Text } from 'slate';

export default function createCell(text) {
  return Block.create({
    type: 'table-heading',
    nodes: [
      Text.fromJSON({
        kind: 'text',
        text: text || '',
      }),
    ],
  });
}
