/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UNSAFE_NavigationContext, useNavigate, Location } from 'react-router-dom';
import { History, Blocker, Transition } from 'history';
import { useTranslation } from 'react-i18next';
import AlertModal from '../../components/AlertModal';
import { MessageSeverity } from '../../interfaces';

interface Props {
  text: string;
  severity?: MessageSeverity;
  isSubmitting: boolean;
  formIsDirty: boolean;
  onContinue?: () => void;
}

// V6 has not added useBlocker hook yet. Source taken from react-router.
const useBlocker = (blocker: Blocker, when = true): void => {
  const navigator = useContext(UNSAFE_NavigationContext).navigator as History;

  useEffect(() => {
    if (!when) return;
    let unblock = navigator.block((tx: Transition) => {
      let autoUnblockingTx = {
        ...tx,
        retry() {
          // Automatically unblock the transition so it can play all the way
          // through before retrying it. TODO: Figure out how to re-enable
          // this block if the transition is cancelled for some reason.
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });
    return unblock;
  }, [navigator, blocker, when]);
};

const AlertModalWrapper = ({ text, severity, isSubmitting, formIsDirty, onContinue }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [discardChanges, setDiscardChanges] = useState(false);
  const [nextLocation, setNextLocation] = useState<Location | undefined>(undefined);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const shouldBlock = !(isSubmitting || !formIsDirty || discardChanges);

  useEffect(() => {
    if (!shouldBlock && nextLocation) {
      navigate(nextLocation); //
    }
  }, [shouldBlock, nextLocation, navigate]);

  useBlocker(transition => {
    if (shouldBlock) {
      setOpenModal(true);
      setNextLocation(transition.location);
    } else {
      setDiscardChanges(false);
    }
  }, shouldBlock);

  const onCancel = () => {
    setOpenModal(false);
  };

  const onWillContinue = () => {
    if (onContinue) onContinue();
    setDiscardChanges(true);
    setOpenModal(false);
  };

  return (
    <AlertModal
      show={openModal}
      text={text}
      actions={[
        {
          text: t('form.abort'),
          onClick: onCancel,
        },
        {
          text: t('alertModal.continue'),
          onClick: onWillContinue,
        },
      ]}
      onCancel={onCancel}
      severity={severity}
    />
  );
};

AlertModalWrapper.propTypes = {
  text: PropTypes.string,
  severity: PropTypes.string,
  isSubmitting: PropTypes.bool,
  formIsDirty: PropTypes.bool,
  onContinue: PropTypes.func,
};

export default AlertModalWrapper;
