/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { Link as LinkIcon } from '@ndla/icons/editor';
import BEMHelper from 'react-bem-helper';
import { Pencil, Minus } from '@ndla/icons/action';
import Overlay from '../../../components/Overlay';
import RoundIcon from '../../../components/RoundIcon';
import AlertModal from '../../../components/AlertModal';
import { Portal } from '../../../components/Portal';
import MenuItemButton from './menuOptions/MenuItemButton';
import CrossButton from '../../../components/CrossButton';

const classes = new BEMHelper({
  name: 'settingsMenu',
  prefix: 'c-',
});

class EditLinkButton extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.deleteTopicLink = this.deleteTopicLink.bind(this);
    this.setPrimary = this.setPrimary.bind(this);
  }

  onCancel() {
    this.setState({
      setPrimaryWarning: false,
      deleteLinkWarning: false,
    });
  }

  setPrimary() {
    const { setPrimary, id } = this.props;
    this.setState({ setPrimaryWarning: false, open: false });
    setPrimary(id);
  }

  deleteTopicLink() {
    const { deleteTopicLink, id } = this.props;
    this.setState({ deleteLinkWarning: false, open: false });
    deleteTopicLink(id);
  }

  toggleOpen() {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  render() {
    const { refFunc, id, t } = this.props;
    const { setPrimaryWarning, deleteLinkWarning } = this.state;
    const linkId = `linkButton-${id}`;
    return (
      <div style={{ display: 'none' }} ref={el => refFunc(el, linkId)}>
        <Portal isOpened>
          <AlertModal
            show={setPrimaryWarning}
            text={t('taxonomy.confirmSetPrimary')}
            onCancel={this.onCancel}
            actions={[
              {
                text: t('form.abort'),
                onClick: this.onCancel,
              },
              { text: t('alertModal.continue'), onClick: this.setPrimary },
            ]}
          />
        </Portal>
        <Portal isOpened>
          <AlertModal
            show={deleteLinkWarning}
            text={t('taxonomy.confirmDeleteTopic')}
            onCancel={this.onCancel}
            actions={[
              {
                text: t('form.abort'),
                onClick: this.onCancel,
              },
              { text: t('alertModal.delete'), onClick: this.deleteTopicLink },
            ]}
          />
        </Portal>
        <Button stripped onClick={this.toggleOpen}>
          <RoundIcon icon={<LinkIcon />} />
        </Button>
        {this.state.open && (
          <React.Fragment>
            <Portal isOpened>
              <Overlay onExit={this.toggleOpen} />
            </Portal>
            <div {...classes('openMenu')}>
              <div className="header">
                <RoundIcon icon={<LinkIcon />} open />
                <span>{t(`taxonomy.linkSettings`)}</span>
                <CrossButton
                  stripped
                  {...classes('closeButton')}
                  onClick={this.toggleOpen}
                />
              </div>
              <MenuItemButton
                stripped
                onClick={() => this.setState({ setPrimaryWarning: true })}>
                <RoundIcon small icon={<Pencil />} />
                {t('taxonomy.setPrimary')}
              </MenuItemButton>
              <MenuItemButton
                stripped
                onClick={() => this.setState({ deleteLinkWarning: true })}>
                <RoundIcon small icon={<Minus />} />
                {t('taxonomy.removeLink')}
              </MenuItemButton>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

EditLinkButton.propTypes = {
  refFunc: PropTypes.func,
  id: PropTypes.string,
  setPrimary: PropTypes.func,
  deleteTopicLink: PropTypes.func,
};

export default injectT(EditLinkButton);
