/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { string, bool, arrayOf, shape, func } from 'prop-types';
import { spacing, fonts } from '@ndla/core';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { css } from '@emotion/core';
import BEMHelper from 'react-bem-helper';
import SettingsMenu from './SettingsMenu';

import { TAXONOMY_ADMIN_SCOPE } from '../../../constants';
import AlertModal from '../../../components/AlertModal';

export const classes = new BEMHelper({
  name: 'folder',
  prefix: 'c-',
});

const resourceButtonStyle = css`
  margin: 3px ${spacing.xsmall} 3px auto;
  ${fonts.sizes(14, 1.1)};
`;

const FolderItem = ({
  name,
  pathToString,
  id,
  jumpToResources,
  isMainActive,
  userAccess,
  metadata,
  ...rest
}) => {
  const {t} = useTranslation();
  const type = id.includes('subject') ? 'subject' : 'topic';
  const showJumpToResources = isMainActive && type === 'topic';

  const [showAlertModal, setShowAlertModal] = useState(false);

  return (
    <div data-cy="folderWrapper" {...classes('wrapper')}>
      {isMainActive && (
        <SettingsMenu
          id={id}
          name={name}
          type={type}
          path={pathToString}
          showAllOptions={userAccess && userAccess.includes(TAXONOMY_ADMIN_SCOPE)}
          metadata={metadata}
          setShowAlertModal={setShowAlertModal}
          {...rest}
        />
      )}
      {showJumpToResources && (
        <Button outline css={resourceButtonStyle} type="button" onClick={jumpToResources}>
          {t('taxonomy.jumpToResources')}
        </Button>
      )}
      {
        <AlertModal
          show={showAlertModal}
          text={t('taxonomy.resource.copyError')}
          actions={[
            {
              text: t('alertModal.continue'),
              onClick: () => {
                setShowAlertModal(false);
              },
            },
          ]}
          onCancel={() => {
            setShowAlertModal(false);
          }}
        />
      }
    </div>
  );
};

FolderItem.propTypes = {
  name: string.isRequired,
  pathToString: string,
  isMainActive: bool,
  id: string.isRequired,
  jumpToResources: func,
  refreshTopics: func,
  userAccess: string,
  metadata: shape({
    grepCodes: arrayOf(string),
    visible: bool,
  }),
};

export default withRouter(FolderItem);
