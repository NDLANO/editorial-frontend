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
  Quote,
  Underline,
  Link,
  Heading2,
  Section,
} from 'ndla-ui/icons';
import Types from 'slate-prop-types';
import { toolbarClasses } from './SlateToolbar';

const toolbarIcon = {
  bold: <Bold />,
  italic: <Italic />,
  underlined: <Underline />,
  quote: <Quote />,
  link: <Link />,
  'numbered-list': <ListNumbered />,
  'bulleted-list': <ListCircle />,
  'heading-two': <Heading2 />,
  footnote: <Section />,
};

const ToolbarButton = ({ state, type, kind, handleHasType, handleOnClick }) => {
  const isActive = handleHasType(state, type, kind);
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
  state: Types.state.isRequired,
  handleHasType: PropTypes.func.isRequired,
  handleOnClick: PropTypes.func.isRequired,
};

export default ToolbarButton;
