/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import FocusTrapReact from 'focus-trap-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, spacing, fonts } from '@ndla/core';
import { Menu } from '@ndla/icons/common';
import SafeLink from '@ndla/safelink';
import { Logo } from '@ndla/ui';
import NavigationMenu from './NavigationMenu';
import SessionContainer from './SessionContainer';
import { Column, GridContainer } from '../../../components/Layout/Layout';
import Overlay from '../../../components/Overlay';
import config from '../../../config';
import SavedSearchDropdown from '../SavedSearchDropdown';

const StyledLogoDiv = styled.div`
  transform: translateY(3px);
`;

interface StyledNavigationWrapperProps {
  backgroundColor?: string;
}

const StyledNavigationWrapper = styled.div<StyledNavigationWrapperProps>`
  position: relative;
  z-index: 4;
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

const LinkWrapper = styled.div`
  gap: ${spacing.small};
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
        return { color: colors.brand.lighter, name: t('environment.staging') };
      default:
        return { color: colors.assessmentResource.background, name: t('environment.test') };
    }
  }, [t]);

  const toggleOpen = () => {
    setOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      <FocusTrapReact
        active={open}
        focusTrapOptions={{
          onDeactivate: closeMenu,
          clickOutsideDeactivates: true,
          escapeDeactivates: true,
        }}
      >
        <StyledNavigationWrapper backgroundColor={envSettings?.color}>
          <FlexWrapper>
            <EnvText>
              <StyledEnvironmentText>{envSettings.name}</StyledEnvironmentText>
            </EnvText>
            <GridContainer>
              <Column>
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
                      <SafeLink
                        to="/"
                        aria-label={t('logo.altText')}
                        title={t('logo.altText')}
                        reloadDocument
                      >
                        <Logo label={t('logo.altText')} />
                      </SafeLink>
                    </StyledLogoDiv>
                    <SavedSearchDropdown onClose={closeMenu} />
                  </LeftContent>
                  <LinkWrapper>
                    <SafeLink target="_blank" to="https://edndla.zendesk.com/hc/no">
                      Zendesk
                    </SafeLink>
                    <SafeLink target="_blank" to="https://kvalitet.ndla.no/">
                      Kvalitaisen
                    </SafeLink>
                  </LinkWrapper>
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
    </>
  );
};

export default Navigation;
