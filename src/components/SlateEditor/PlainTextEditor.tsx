/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useEffect, useCallback } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, ReactEditor, RenderLeafProps, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { FormikHandlers, useFormikContext } from 'formik';
import { SlatePlugin } from './interfaces';
import withPlugins from './utils/withPlugins';
import { ArticleFormType } from '../../containers/FormikForm/articleFormHooks';
import { FormikStatus } from '../../interfaces';
import { SlateToolbar } from './plugins/toolbar';

interface Props {
  id: string;
  value: Descendant[];
  submitted: boolean;
  onChange: FormikHandlers['handleChange'];
  className?: string;
  placeholder?: string;
  plugins?: SlatePlugin[];
}

const PlainTextEditor = ({
  onChange,
  value,
  submitted,
  id,
  className,
  placeholder,
  plugins,
  ...rest
}: Props) => {
  const _editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const editor = useMemo(() => withPlugins(_editor, plugins), [_editor, plugins]);

  const onBlur = useCallback(() => {
    ReactEditor.deselect(editor);
  }, [editor]);

  const onSlateChange = useCallback(
    (val: Descendant[]) =>
      onChange({
        target: {
          name: id,
          value: val,
          type: 'SlateEditorValue',
        },
      }),
    [id, onChange],
  );

  const { status, setStatus } = useFormikContext<ArticleFormType>();

  useEffect(() => {
    if (status?.status === 'revertVersion') {
      ReactEditor.deselect(editor);
      editor.children = value;
      setStatus((prevStatus: FormikStatus) => ({ ...prevStatus, status: undefined }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const renderLeaf = useCallback((renderProps: RenderLeafProps) => {
    const { attributes, children } = renderProps;
    if (editor.renderLeaf) {
      const ret = editor.renderLeaf(renderProps);
      if (ret) {
        return ret;
      }
    }
    return <span {...attributes}>{children}</span>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Slate editor={editor} value={value} onChange={onSlateChange}>
      <SlateToolbar variant={'minimal'} />
      <Editable
        id={id}
        // Forcing slate field to be deselected before selecting new field.
        // Fixes a problem where slate field is not properly focused on click.
        onBlur={onBlur}
        // @ts-ignore is-hotkey and editor.onKeyDown does not have matching types
        onKeyDown={editor.onKeyDown}
        readOnly={submitted}
        className={className}
        placeholder={placeholder}
        renderPlaceholder={undefined}
        renderLeaf={renderLeaf}
        {...rest}
      />
    </Slate>
  );
};

export default PlainTextEditor;
