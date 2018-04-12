import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { Link as LinkIcon } from 'ndla-icons/editor';
import BEMHelper from 'react-bem-helper';
import { Cross, Pencil } from 'ndla-icons/action';
import Overlay from '../../../components/Overlay';
import RoundIcon from './RoundIcon';

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
    const { refFunc, id, t } = this.props;
    return (
      <div
        style={{ display: 'none' }}
        ref={el => refFunc(el, `linkButton-${id}`)}>
        <Button stripped onClick={() => this.setState({ open: true })}>
          <RoundIcon icon={<LinkIcon />} />
        </Button>
        {this.state.open && (
          <React.Fragment>
            <Overlay onExit={() => this.setState({ open: false })} />
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
                <RoundIcon icon={<Pencil />} />
                {t('taxonomy.setPrimary')}
              </Button>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

EditLinkButton.propTypes = {};

export default injectT(EditLinkButton);
