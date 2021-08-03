const slatereact = jest.createMockFromModule('slate-react');

slatereact.ReactEditor.findPath = (editor, element) => {
  return [0, 0, 0];
};

module.exports = slatereact;
