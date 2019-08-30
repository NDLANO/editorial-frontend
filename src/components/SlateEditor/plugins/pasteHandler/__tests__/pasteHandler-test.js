import { Block } from 'slate';
import { convertToSupportedBlockTypes } from '..';

const lineBlock = {
  data: {},
  nodes: [
    {
      text: 'Text from PlaintextEditor',
      object: 'text',
      marks: [],
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
