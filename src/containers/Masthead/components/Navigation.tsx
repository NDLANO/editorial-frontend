/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fonts } from '@ndla/core';
import { Logo } from '@ndla/ui';
import FocusTrapReact from 'focus-trap-react';
import styled from '@emotion/styled';
import MastheadButton from './MastheadButton';
import MastheadSearch from '../MastheadSearch';
import SessionContainer from './SessionContainer';
import NavigationMenu from './NavigationMenu';
import Overlay from '../../../components/Overlay';
import config from '../../../config';
import { NAVIGATION_HEADER_MARGIN } from '../../../constants';

const StyledLogoDiv = styled.div`
  transform: translateY(3px);
`;

const StyledSplitter = styled.div`
  height: ${spacing.medium};
  width: 1px;
  background: ${colors.brand.greyLighter};
  margin: 0 ${spacing.normal};
`;

interface StyledNavigationWrapperProps {
  backgroundColor?: string;
  open?: boolean;
}

const StyledNavigationWrapper = styled.div<StyledNavigationWrapperProps>`
  position: absolute;

  z-index: ${props => props.open && '3'};
  top: 0;
  left: 0;
  right: 0;
  padding: ${spacing.xsmall};
  background: ${props => props.backgroundColor};
`;

const StyledHeaderItems = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 972px;
  flex: 4;
  > div {
    display: flex;
    align-items: center;
  }
`;

const StyledWrapper = styled.div`
  margin-bottom: ${NAVIGATION_HEADER_MARGIN};
`;
const StyledEnvironmentText = styled.p`
  font-weight: ${fonts.weight.semibold};
  color: ${colors.brand.primary};
  margin: 0px 0px 0px ${spacing.small};
`;

const FlexWrapper = styled.div`
  display: flex;
`;

const OuterContent = styled(FlexWrapper)`
  flex: 1;
  align-items: center;
`;

interface EnvironmentSettings {
  color: string;
  name: string;
}

const Navigation = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [envSettings, setEnvSettings] = useState<EnvironmentSettings>();

  const toggleOpen = () => {
    setOpen(prevState => !prevState);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const getEnvironmentSettings = (): EnvironmentSettings => {
    switch (config.ndlaEnvironment) {
      case 'prod':
        return { color: colors.white, name: t('environment.production') };
      case 'staging':
        return { color: colors.brand.greyLighter, name: t('environment.staging') };
      default:
        return { color: colors.brand.greyLight, name: t('environment.test') };
    }
  };

  useEffect(() => {
    if (!envSettings) setEnvSettings(getEnvironmentSettings());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledWrapper>
      <FocusTrapReact
        active={open}
        focusTrapOptions={{
          onDeactivate: closeMenu,
          clickOutsideDeactivates: true,
          escapeDeactivates: true,
        }}>
        <StyledNavigationWrapper open={open} backgroundColor={envSettings?.color}>
          <FlexWrapper>
            <OuterContent>
              <StyledEnvironmentText>{envSettings?.name}</StyledEnvironmentText>
            </OuterContent>
            <StyledHeaderItems>
              <div>
                <MastheadButton onClick={toggleOpen} open={open} />
                <StyledSplitter />
                <MastheadSearch close={closeMenu} />
              </div>
              <div>
                <SessionContainer close={closeMenu} />
                <StyledSplitter />
                <StyledLogoDiv>
                  <Logo to="/" label={t('logo.altText')} />
                </StyledLogoDiv>
              </div>
            </StyledHeaderItems>
            <OuterContent />
          </FlexWrapper>
          {open && <NavigationMenu close={closeMenu} />}
        </StyledNavigationWrapper>
      </FocusTrapReact>
      {open && <Overlay modifiers={'lighter'} />}
    </StyledWrapper>
  );
};

export default Navigation;
