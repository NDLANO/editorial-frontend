/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikHandlers, useFormikContext } from "formik";
import { useEffect, useCallback, useState } from "react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, ReactEditor, withReact } from "slate-react";
import { EditableProps } from "slate-react/dist/components/editable";
import styled from "@emotion/styled";
import { useFormControl } from "@ndla/forms";
import { SlatePlugin } from "./interfaces";
import withPlugins from "./utils/withPlugins";
import { ArticleFormType } from "../../containers/FormikForm/articleFormHooks";
import { FormikStatus } from "../../interfaces";

const StyledEditable = styled(Editable)`
  outline: none;
`;
const StyledPlaceholder = styled.div`
  display: inline-block;
  width: 0;
  white-space: nowrap;
  opacity: 0.33;
  pointer-events: none;
`;

interface Props extends Omit<EditableProps, "value"> {
  id: string;
  value: Descendant[];
  onChange: FormikHandlers["handleChange"];
  submitted?: boolean;
  className?: string;
  placeholder?: string;
  plugins?: SlatePlugin[];
}

const PlainTextEditor = ({ onChange, value, id, submitted, className, placeholder, plugins, ...rest }: Props) => {
  const [editor] = useState(() => withPlugins(withHistory(withReact(createEditor())), plugins));
  const props = useFormControl({ id, readOnly: submitted, ...rest });

  const onBlur = useCallback(() => {
    ReactEditor.deselect(editor);
  }, [editor]);

  const onSlateChange = useCallback(
    (val: Descendant[]) =>
      onChange({
        target: {
          name: id,
          value: val,
          type: "SlateEditorValue",
        },
      }),
    [id, onChange],
  );

  const { status, setStatus } = useFormikContext<ArticleFormType>();

  useEffect(() => {
    if (status?.status === "revertVersion") {
      ReactEditor.deselect(editor);
      editor.children = value;
      setStatus((prevStatus: FormikStatus) => ({
        ...prevStatus,
        status: undefined,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <Slate editor={editor} initialValue={value} onChange={onSlateChange}>
      <StyledEditable
        // Forcing slate field to be deselected before selecting new field.
        // Fixes a problem where slate field is not properly focused on click.
        onBlur={onBlur}
        // @ts-ignore is-hotkey and editor.onKeyDown does not have matching types
        onKeyDown={editor.onKeyDown}
        className={className}
        placeholder={placeholder}
        renderPlaceholder={({ children, attributes }) => {
          // Remove inline styling to be able to apply styling from StyledPlaceholder
          const { style, ...remainingAttributes } = attributes;
          return <StyledPlaceholder {...remainingAttributes}>{children}</StyledPlaceholder>;
        }}
        {...props}
      />
    </Slate>
  );
};

export default PlainTextEditor;
