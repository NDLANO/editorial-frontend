import React from 'react';
import TableActions from './TableActions';

const SlateTable = (props) => {
  console.log(props);
  const { state, editor, attributes} = props;
  return (
    <div {...attributes}>
      <TableActions state={state} editor={editor} />
      <table>
        <tbody>
          {props.children}
        </tbody>
      </table>
    </div>
  )
};

export default SlateTable;
