import { Descendant } from 'slate';

export interface ConceptBlockElement {
  type: 'concept-block';
  data: { [key: string]: string };
  children: Descendant[];
}
