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
  Quote, // TODO: Change to Quote when Icon is available
  Strikethrough,
  Underline,
  Link,
  Heading1,
  Heading2,
  Heading3,
} from 'ndla-ui/icons';
import { toolbarClasses } from './SlateToolbar';

const toolbarIcon = {
  bold: <Bold />,
  italic: <Italic />,
  strikethrough: <Strikethrough />,
  underlined: <Underline />,
  quote: <Quote />,
  link: <Link />,
  'numbered-list': <ListNumbered />,
  'bulleted-list': <ListCircle />,
  'heading-one': <Heading1 />,
  'heading-two': <Heading2 />,
  'heading-three': <Heading3 />,
};

const ToolbarButton = ({ type, handleHasType, handleOnClick }) => {
  const isActive = handleHasType(type);
  const onMouseDown = e => handleOnClick(e, type);

  return (
    <Button stripped onMouseDown={onMouseDown} data-active={isActive}>
      <span {...toolbarClasses('icon')}>
        {toolbarIcon[type]}
      </span>
    </Button>
  );
};

ToolbarButton.propTypes = {
  type: PropTypes.string.isRequired,
  handleHasType: PropTypes.func.isRequired,
  handleOnClick: PropTypes.func.isRequired,
};

export default ToolbarButton;
