/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'ndla-button';
import { injectT } from 'ndla-i18n';
import { Link as LinkIcon } from 'ndla-icons/editor';
import BEMHelper from 'react-bem-helper';
import { Cross, Pencil, Minus } from 'ndla-icons/action';
import Overlay from '../../../components/Overlay';
import RoundIcon from '../../../components/RoundIcon';
import WarningModal from '../../../components/WarningModal';
import { Portal } from '../../../components/Portal';

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
  }

  render() {
    const { refFunc, id, t, setPrimary, deleteTopicLink } = this.props;
    const linkId = `linkButton-${id}`;
    return (
      <div
        style={{ display: 'none' }}
        id={linkId}
        ref={el => refFunc(el, linkId)}>
        <Portal isOpened>
          <WarningModal
            show={this.state.setPrimaryWarning}
            text={t('taxonomy.confirmSetPrimary')}
            onCancel={() => this.setState({ setPrimaryWarning: false })}
            actions={[
              {
                text: t('form.abort'),
                onClick: () => this.setState({ setPrimaryWarning: false }),
              },
              {
                text: t('warningModal.confirm'),
                onClick: () => {
                  this.setState({ setPrimaryWarning: false, open: false });
                  setPrimary();
                },
              },
            ]}
          />
        </Portal>
        <Portal isOpened>
          <WarningModal
            show={this.state.deleteLinkWarning}
            text={t('taxonomy.confirmDeleteTopic')}
            onCancel={() => this.setState({ deleteLinkWarning: false })}
            actions={[
              {
                text: t('form.abort'),
                onClick: () => this.setState({ deleteLinkWarning: false }),
              },
              {
                text: t('warningModal.delete'),
                onClick: () => {
                  this.setState({ deleteLinkWarning: false, open: false });
                  deleteTopicLink(id);
                },
              },
            ]}
          />
        </Portal>
        <Button
          stripped
          onClick={() => {
            this.setState({ open: true });
          }}>
          <RoundIcon icon={<LinkIcon />} />
        </Button>
        {this.state.open && (
          <React.Fragment>
            <Portal isOpened>
              <Overlay onExit={() => this.setState({ open: false })} />
            </Portal>
            <div {...classes('openMenu')}>
              <div className="header">
                <RoundIcon icon={<LinkIcon />} open />
                <span>{t(`taxonomy.linkSettings`)}</span>
                <Button
                  stripped
                  {...classes('closeButton')}
                  onClick={() => this.setState({ open: false })}>
                  <Cross />
                </Button>
              </div>
              <Button
                stripped
                {...classes('menuItem')}
                onClick={() => this.setState({ setPrimaryWarning: true })}>
                <RoundIcon small icon={<Pencil />} />
                {t('taxonomy.setPrimary')}
              </Button>
              <Button
                stripped
                {...classes('menuItem')}
                onClick={() => this.setState({ deleteLinkWarning: true })}>
                <RoundIcon small icon={<Minus />} />
                {t('taxonomy.removeLink')}
              </Button>
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
