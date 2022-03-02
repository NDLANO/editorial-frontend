import { Descendant } from 'slate';

export interface ConceptInlineElement {
  type: 'concept-inline';
  data: { [key: string]: string };
  children: Descendant[];
}
