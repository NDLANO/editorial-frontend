/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import FocusTrapReact from 'focus-trap-react';
import styled from '@emotion/styled';
import { PersonOutlined } from '@ndla/icons/common';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fonts } from '@ndla/core';
import { Link } from 'react-router-dom';
import { toLogoutSession, toLogin } from '../../../util/routeHelpers';
import { getAccessTokenPersonal } from '../../../util/authHelpers';
import { styledListElement } from '../../../components/StyledListElement/StyledListElement';
import Overlay from '../../../components/Overlay';
import { StyledDropdownOverlay } from '../../../components/Dropdown';
import { useSession } from '../../Session/SessionProvider';

const StyledUserIcon = styled(PersonOutlined)`
  color: ${colors.brand.primary};
  width: ${spacing.normal};
  height: ${spacing.normal};
`;

const StyledUserButton = styled(ButtonV2)`
  font-weight: ${fonts.weight.semibold};
  color: ${colors.brand.primary};

  &:hover,
  &:focus-visible {
    color: ${colors.black};
  }
`;

interface AuthSiteNavItemProps {
  logoutText: string;
  onClick: () => void;
}

const AuthSiteNavItem = ({ logoutText, onClick }: AuthSiteNavItemProps) => (
  <StyledDropdownOverlay withArrow>
    <Link css={styledListElement} to={toLogoutSession()} onClick={onClick}>
      {logoutText}
    </Link>
  </StyledDropdownOverlay>
);

interface Props {
  close: () => void;
}

const SessionContainer = ({ close }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { userName, authenticated } = useSession();

  const toggleOpen = (newOpen?: boolean) => setOpen((prevOpen) => newOpen ?? !prevOpen);

  const isAccessTokenPersonal = getAccessTokenPersonal();

  return (
    <div>
      {open && (
        <>
          <FocusTrapReact
            active
            focusTrapOptions={{
              onDeactivate: () => {
                toggleOpen(false);
              },
              clickOutsideDeactivates: true,
              escapeDeactivates: true,
            }}
          >
            <div>
              <AuthSiteNavItem logoutText={t('logoutProviders.localLogout')} onClick={toggleOpen} />
            </div>
          </FocusTrapReact>
          <Overlay />
        </>
      )}
      {authenticated && isAccessTokenPersonal ? (
        <StyledUserButton
          onClick={() => {
            toggleOpen();
            close();
          }}
          variant="ghost"
          colorTheme="lighter"
          shape="pill"
        >
          <StyledUserIcon />
          {userName?.split(' ')[0]}
        </StyledUserButton>
      ) : (
        <Link to={toLogin()}>{t('siteNav.login')}</Link>
      )}
    </div>
  );
};

export default SessionContainer;
