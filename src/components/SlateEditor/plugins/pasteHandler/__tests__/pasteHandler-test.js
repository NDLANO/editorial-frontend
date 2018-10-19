import { Block } from 'slate';
import { convertToSupportedBlockTypes } from '..';

const lineBlock = {
  data: {},
  nodes: [
    {
      leaves: [
        {
          marks: [],
          object: 'leaf',
          text: 'Text from PlaintextEditor',
        },
      ],
      object: 'text',
    },
  ],
  object: 'block',
  type: 'line',
};

test('Paste transforms plaintext line block type to paragraph type', () => {
  const pastedBlock = Block.fromJSON(lineBlock);
  const convertedBlock = convertToSupportedBlockTypes(pastedBlock);
  expect(convertedBlock.toJSON()).toMatchSnapshot();
});
