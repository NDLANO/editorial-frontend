/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import { findDOMNode } from 'slate-react';
import Types from 'slate-prop-types';
import PropTypes from 'prop-types';
import { SlateBlockMenu } from 'ndla-editor';
import {
  Quote,
  Camera,
  FactBoxMaterial,
  Link as LinkIcon,
  TableMaterial,
  ArrowExpand,
  Framed,
  PlayBoxOutline,
  PresentationPlay,
} from 'ndla-icons/editor';

import { Portal } from '../../../Portal';
import { defaultBlocks } from '../../utils';
import { defaultBodyBoxBlock } from '../bodybox';
import { defaultDetailsBlock } from '../detailsbox';
import SlateEmbedPicker from './SlateEmbedPicker';
import { editTablePlugin } from '../externalPlugins';

const { defaultAsideBlock, defaultRelatedBlock } = defaultBlocks;

const actions = [
  {
    data: { type: 'block', object: 'block' },
    label: 'Paragraf',
    icon: <Quote />,
  },
  {
    data: { type: 'aside', object: 'factAside' },
    label: 'Faktaboks',
    icon: <FactBoxMaterial />,
  },
  {
    data: { type: 'table', object: 'table' },
    label: 'Tabell',
    icon: <TableMaterial />,
  },
  {
    data: { type: 'bodybox', object: 'bodybox' },
    label: 'Tekst i ramme',
    icon: <Framed />,
  },
  {
    data: { type: 'details', object: 'details' },
    label: 'Ekspanderende boks',
    icon: <ArrowExpand />,
  },
  {
    data: { type: 'embed', object: 'image' },
    label: 'Bilde',
    icon: <Camera />,
  },
  {
    data: { type: 'embed', object: 'video' },
    label: 'Video',
    icon: <PlayBoxOutline />,
  },
  {
    data: { type: 'embed', object: 'audio' },
    label: 'Lyd',
    icon: <Quote />,
  },
  {
    data: { type: 'embed', object: 'h5p' },
    label: 'H5P',
    icon: <PresentationPlay />,
  },
  {
    data: { type: 'related', object: 'related' },
    label: 'Relatert artikkel',
    icon: <LinkIcon />,
  },
];

class SlateBlockPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      embedSelect: {
        isOpen: false,
      },
    };
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
    this.onElementAdd = this.onElementAdd.bind(this);
    this.showPicker = this.showPicker.bind(this);
    this.focusInsideIllegalArea = this.focusInsideIllegalArea.bind(this);
    this.onEmbedClose = this.onEmbedClose.bind(this);
    this.onInsertBlock = this.onInsertBlock.bind(this);
    this.slateBlockRef = React.createRef();
    this.slateBlockButtonRef = React.createRef();
    this.zIndexTimeout = null;
  }

  componentDidMount() {
    this.slateBlockRef.current.style.transition = 'opacity 200ms ease';
    this.slateBlockRef.current.style.position = 'absolute';
  }

  componentDidUpdate() {
    this.showPicker();
  }

  onEmbedClose() {
    this.setState({ embedSelect: { isOpen: false, embedType: '' } });
  }

  onInsertBlock(block) {
    const { editorValue, onChange } = this.props;
    const nextChange = editorValue.change().insertBlock(block);
    onChange(nextChange);
  }

  onElementAdd(block) {
    const { editorValue, onChange, addSection } = this.props;
    switch (block.type) {
      case 'block': {
        addSection();
        break;
      }
      case 'bodybox': {
        this.onInsertBlock(defaultBodyBoxBlock());
        break;
      }
      case 'details': {
        this.onInsertBlock(defaultDetailsBlock());
        break;
      }
      case 'table': {
        const change = editorValue.change();
        onChange(editTablePlugin.changes.insertTable(change, 2, 2));
        break;
      }
      case 'aside': {
        this.onInsertBlock(defaultAsideBlock(block.object));
        break;
      }
      case 'embed': {
        this.setState({
          embedSelect: { isOpen: true, embedType: block.object },
        });
        break;
      }
      case 'related': {
        this.onInsertBlock(defaultRelatedBlock());
        break;
      }
      default:
        break;
    }
    this.setState({ isOpen: false });
  }

  getDerviedStateFromProps(nextProps, prevState) {
    if (!nextProps.editorValue.isFocused && prevState.isOpen) {
      this.setState({ isOpen: false });
    }
  }

  toggleIsOpen(isOpen) {
    this.setState({ isOpen });
  }

  update(nodeEl) {
    const { current: slateBlockRef } = this.slateBlockRef;
    if (slateBlockRef) {
      const rect = nodeEl.getBoundingClientRect();
      slateBlockRef.style.top = `${rect.top -
        nodeEl.parentNode.parentNode.parentNode.getBoundingClientRect().top +
        6.5}px`;
      slateBlockRef.style.left = '-78px';
      slateBlockRef.style.position = 'absolute';
      slateBlockRef.style.opacity = 1;
      this.slateBlockButtonRef.current.setAttribute('aria-hidden', false);
      this.slateBlockButtonRef.current.tabIndex = 0;
      this.slateBlockButtonRef.current.disabled = false;
      clearTimeout(this.zIndexTimeout);
      this.zIndexTimeout = setTimeout(() => {
        slateBlockRef.style.zIndex = 999;
      }, 100);
    }
  }

  focusInsideIllegalArea() {
    const { editorValue, illegalAreas } = this.props;
    let node = editorValue.document.getClosestBlock(
      editorValue.selection.start.key,
    );
    while (true) {
      const parent = editorValue.document.getParent(node.key);
      if (
        !parent ||
        parent.get('type') === 'section' ||
        parent.get('type') === 'document'
      ) {
        return false;
      }
      if (illegalAreas.includes(parent.get('type'))) {
        return true;
      }
      node = parent;
    }
  }

  showPicker() {
    const { editorValue, allowedPickAreas } = this.props;

    const node = editorValue.document.getClosestBlock(
      editorValue.selection.start.key,
    );

    const show =
      this.state.isOpen ||
      (node &&
        node.text.length === 0 &&
        !this.focusInsideIllegalArea() &&
        allowedPickAreas.includes(node.type) &&
        editorValue.selection.isFocused);

    if (show) {
      const nodeEl = findDOMNode(node); // eslint-disable-line react/no-find-dom-node
      this.update(nodeEl);
    } else {
      const { current: slateBlockRef } = this.slateBlockRef;
      slateBlockRef.style.opacity = 0;
      this.slateBlockButtonRef.current.setAttribute('aria-hidden', true);
      this.slateBlockButtonRef.current.tabIndex = -1;
      this.slateBlockButtonRef.current.disabled = true;
      clearTimeout(this.zIndexTimeout);
      this.zIndexTimeout = setTimeout(() => {
        slateBlockRef.style.zIndex = 0;
      }, 100);
    }
  }

  render() {
    const { isOpen, embedSelect } = this.state;
    return (
      <Fragment>
        <Portal isOpened>
          {embedSelect.isOpen && (
            <SlateEmbedPicker
              resource={embedSelect.embedType}
              isOpen={embedSelect.isOpen}
              onEmbedClose={this.onEmbedClose}
              onInsertBlock={this.onInsertBlock}
            />
          )}
        </Portal>
        <div ref={this.slateBlockRef}>
          <SlateBlockMenu
            ref={this.slateBlockButtonRef}
            cy="slate-block-picker"
            isOpen={isOpen}
            heading="Legg til"
            actions={actions}
            onToggleOpen={this.toggleIsOpen}
            clickItem={data => {
              this.onElementAdd(data);
            }}
          />
        </div>
      </Fragment>
    );
  }
}

SlateBlockPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  editorValue: Types.value.isRequired,
  addSection: PropTypes.func.isRequired,
  allowedPickAreas: PropTypes.arrayOf(PropTypes.string),
  illegalAreas: PropTypes.arrayOf(PropTypes.string),
};

export default SlateBlockPicker;
