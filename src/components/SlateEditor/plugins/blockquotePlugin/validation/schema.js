import { Block } from 'slate';

/**
 *  Ensures that blockquotes always contain blocks.
 */
function containBlocks(opts, editor, context) {
  const toWrap = context.node.nodes.filter(n => n.object !== 'block');

  if (toWrap.isEmpty()) {
    return undefined;
  }

  // Wrap text/inline nodes in default block
  const wrapper = Block.create({
    type: opts.typeDefault,
    nodes: [],
  });
  editor.withoutSaving(() => {
    editor.withoutNormalizing(() => {
      editor.insertNodeByKey(
        context.node.key,
        0,
        wrapper,
        // Be careful of Slate's core schema removing inlines or blocks when
        // a block contains a mix of them.
      );
    });

    toWrap.forEach((child, index) => {
      const isLast = index === toWrap.size - 1;
      editor.moveNodeByKey(child.key, wrapper.key, index, {
        normalize: isLast,
      });
    });
  });
}

/**
 * Create a schema definition with rules to normalize blockquotes
 */
function schema(opts) {
  return {
    blocks: {
      [opts.type]: {
        nodes: [
          {
            objects: ['block'],
          },
        ],
        normalize(change, violation, context) {
          switch (violation) {
            case 'child_object_invalid':
              containBlocks(opts, change, context);
              break;
            default:
              break;
          }
        },
      },
    },
  };
}

export default schema;
