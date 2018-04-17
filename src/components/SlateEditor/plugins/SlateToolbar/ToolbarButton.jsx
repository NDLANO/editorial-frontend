/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import {
  Bold,
  Italic,
  ListCircle,
  ListNumbered,
  ListSquare,
  ListTwoColumns,
  Quote,
  Underline,
  Link,
  Heading2,
  Heading1,
  Section,
} from 'ndla-icons/editor';
import Types from 'slate-prop-types';
import { toolbarClasses } from './SlateToolbar';

// ndla-ui icon for Link type in toolbar has the same name as a link/anchor element component.
// Thus triggering a false positive, that we have to disable.
/* eslint-disable jsx-a11y/anchor-is-valid */
const toolbarIcon = {
  bold: <Bold />,
  italic: <Italic />,
  underlined: <Underline />,
  quote: <Quote />,
  link: <Link />,
  'numbered-list': <ListNumbered />,
  'bulleted-list': <ListCircle />,
  'two-column-list': <ListTwoColumns />,
  'letter-list': <ListSquare />,
  'heading-two': <Heading2 />,
  'heading-one': <Heading1 />,
  footnote: <Section />,
};
/* eslint-enable jsx-a11y/anchor-is-valid */

const ToolbarButton = ({ value, type, kind, handleHasType, handleOnClick }) => {
  const isActive = handleHasType(value, type, kind);
  const onMouseDown = e => handleOnClick(e, kind, type);
  return (
    <Button stripped onMouseDown={onMouseDown} data-active={isActive}>
      <span {...toolbarClasses('icon', isActive ? 'active' : '')}>
        {toolbarIcon[type]}
      </span>
    </Button>
  );
};

ToolbarButton.propTypes = {
  type: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  value: Types.value.isRequired,
  handleHasType: PropTypes.func.isRequired,
  handleOnClick: PropTypes.func.isRequired,
};

export default ToolbarButton;
