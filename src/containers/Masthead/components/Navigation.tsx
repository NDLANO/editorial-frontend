/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fonts } from '@ndla/core';
import { Logo } from '@ndla/ui';
import FocusTrapReact from 'focus-trap-react';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { Menu } from '@ndla/icons/common';
import MastheadSearch from '../MastheadSearch';
import SessionContainer from './SessionContainer';
import NavigationMenu from './NavigationMenu';
import Overlay from '../../../components/Overlay';
import config from '../../../config';
import { NAVIGATION_HEADER_MARGIN } from '../../../constants';
import { Column, GridContainer } from '../../../components/Layout/Layout';

const StyledLogoDiv = styled.div`
  transform: translateY(3px);
`;

interface StyledNavigationWrapperProps {
  backgroundColor?: string;
  open?: boolean;
}

const StyledNavigationWrapper = styled.div<StyledNavigationWrapperProps>`
  position: absolute;
  z-index: ${(props) => props.open && '4'};
  top: 0;
  left: 0;
  right: 0;
  background: ${(props) => props.backgroundColor};
`;

const StyledHeaderItems = styled.div`
  display: flex;
  gap: ${spacing.medium};
  padding: ${spacing.small} 0;
  border-bottom: 1px solid ${colors.brand.neutral7};
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
  margin: 0px;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
`;

const LeftContent = styled.div`
  display: flex;
  gap: ${spacing.normal};
  flex: 1;
`;

const EnvText = styled(FlexWrapper)`
  align-items: center;
  justify-content: flex-start;
  padding-left: ${spacing.small};
`;

const HiddenEnvText = styled(EnvText)`
  visibility: hidden;
`;

interface EnvironmentSettings {
  color: string;
  name: string;
}

const Navigation = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  const envSettings = useMemo((): EnvironmentSettings => {
    switch (config.ndlaEnvironment) {
      case 'prod':
        return { color: colors.white, name: t('environment.production') };
      case 'staging':
        return { color: colors.brand.greyLight, name: t('environment.staging') };
      default:
        return { color: colors.brand.greyLighter, name: t('environment.test') };
    }
  }, [t]);

  const toggleOpen = () => {
    setOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <StyledWrapper>
      <FocusTrapReact
        active={open}
        focusTrapOptions={{
          onDeactivate: closeMenu,
          clickOutsideDeactivates: true,
          escapeDeactivates: true,
        }}
      >
        <StyledNavigationWrapper open={open} backgroundColor={envSettings?.color}>
          <FlexWrapper>
            <EnvText>
              <StyledEnvironmentText>{envSettings.name}</StyledEnvironmentText>
            </EnvText>
            <GridContainer>
              <Column colStart={1} colEnd={13}>
                <StyledHeaderItems>
                  <LeftContent>
                    <IconButtonV2
                      aria-label={t('menu.title')}
                      aria-expanded={open}
                      colorTheme="light"
                      onClick={toggleOpen}
                    >
                      <Menu />
                    </IconButtonV2>
                    <StyledLogoDiv>
                      <Logo to="/" label={t('logo.altText')} />
                    </StyledLogoDiv>
                    <MastheadSearch close={closeMenu} />
                  </LeftContent>
                  <SessionContainer close={closeMenu} />
                </StyledHeaderItems>
              </Column>
            </GridContainer>
            <HiddenEnvText aria-hidden>
              <StyledEnvironmentText>{envSettings.name}</StyledEnvironmentText>
            </HiddenEnvText>
          </FlexWrapper>
          {open && <NavigationMenu close={closeMenu} />}
        </StyledNavigationWrapper>
      </FocusTrapReact>
      {open && <Overlay modifiers={'lighter'} />}
    </StyledWrapper>
  );
};

export default Navigation;
