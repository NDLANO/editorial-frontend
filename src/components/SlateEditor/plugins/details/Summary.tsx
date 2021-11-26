import { RenderElementProps } from 'slate-react';

const Summary = ({ children, element, attributes }: RenderElementProps) => {
  return <span {...attributes}>{children}</span>;
};

export default Summary;
