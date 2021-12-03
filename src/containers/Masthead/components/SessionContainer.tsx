/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import FocusTrapReact from 'focus-trap-react';
import { css } from '@emotion/core';
import { User } from '@ndla/icons/common';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '@ndla/core';
import { Link } from 'react-router-dom';
import { toLogoutSession, toLogin } from '../../../util/routeHelpers';
import { getAccessTokenPersonal } from '../../../util/authHelpers';
import StyledListButton from '../../../components/StyledListButton';
import Overlay from '../../../components/Overlay';
import { StyledDropdownOverlay } from '../../../components/Dropdown';
import { useSession } from '../../Session/SessionProvider';

const userIconCss = css`
  color: ${colors.brand.grey};
  margin-right: ${spacing.xsmall};
`;

const StyledLink = StyledListButton.withComponent(Link);

interface AuthSiteNavItemProps {
  logoutText: string;
  onClick: () => void;
}

const AuthSiteNavItem = ({ logoutText, onClick }: AuthSiteNavItemProps) => (
  <StyledDropdownOverlay withArrow>
    <StyledLink to={toLogoutSession()} onClick={onClick}>
      {logoutText}
    </StyledLink>
  </StyledDropdownOverlay>
);

interface Props {
  close: () => void;
}

const SessionContainer = ({ close }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { userName, authenticated } = useSession();

  const toggleOpen = (newOpen?: boolean) => setOpen(prevOpen => newOpen ?? !prevOpen);

  const isAccessTokenPersonal = getAccessTokenPersonal();

  return (
    <div>
      {authenticated && isAccessTokenPersonal ? (
        <div>
          <User css={userIconCss} className="c-icon--22" />
          <Button
            onClick={() => {
              toggleOpen();
              close();
            }}
            link>
            {userName}
          </Button>
        </div>
      ) : (
        <Link to={toLogin()}>{t('siteNav.login')}</Link>
      )}
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
            }}>
            <div>
              <AuthSiteNavItem logoutText={t('logoutProviders.localLogout')} onClick={toggleOpen} />
            </div>
          </FocusTrapReact>
          <Overlay />
        </>
      )}
    </div>
  );
};

export default SessionContainer;
