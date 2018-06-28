/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { Link as LinkIcon } from 'ndla-icons/editor';
import BEMHelper from 'react-bem-helper';
import { Cross, Pencil } from 'ndla-icons/action';
import Overlay from '../../../components/Overlay';
import RoundIcon from '../../../components/RoundIcon';
import WarningModal from '../../../components/WarningModal';

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
    const { refFunc, id, t, setPrimary } = this.props;
    return (
      <React.Fragment>
        {this.state.open && (
          <Overlay onExit={() => this.setState({ open: false })} />
        )}
        {this.state.showWarning && (
          <WarningModal
            text={t('taxonomy.confirmSetPrimary')}
            onCancel={() => this.setState({ showWarning: false })}
            onContinue={() => setPrimary(id)}
          />
        )}
        <div
          style={{ display: 'none' }}
          ref={el => (el ? refFunc(el, `linkButton-${id}`) : undefined)}>
          <Button stripped onClick={() => this.setState({ open: true })}>
            <RoundIcon icon={<LinkIcon />} />
          </Button>
          {this.state.open && (
            <React.Fragment>
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
                  onClick={() => this.setState({ showWarning: true })}>
                  <RoundIcon small icon={<Pencil />} />
                  {t('taxonomy.setPrimary')}
                </Button>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

EditLinkButton.propTypes = {
  refFunc: PropTypes.func,
  id: PropTypes.string,
  setPrimary: PropTypes.func,
};

export default injectT(EditLinkButton);
