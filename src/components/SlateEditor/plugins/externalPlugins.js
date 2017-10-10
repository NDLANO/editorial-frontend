import EditBlockquote from 'slate-edit-blockquote';
import EditList from 'slate-edit-list';

export const listTypes = ['numbered-list', 'bulleted-list', 'letter-list'];

export const blockquotePlugin = EditBlockquote({ type: 'quote' });
export const editListPlugin = EditList({
  types: listTypes,
  typeItem: 'list-item',
});
