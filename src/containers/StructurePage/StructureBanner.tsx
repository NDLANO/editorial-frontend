/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Switch } from '@ndla/switch';
import { ChangeEventHandler } from 'react';
import { ButtonV2 as Button } from '@ndla/button';
import { Plus } from '@ndla/icons/lib/action';
import { spacing } from '@ndla/core';
import { ResourceGroupBanner, StyledIcon } from './styles';
import { useAddNodeMutation } from '../../modules/nodes/nodeMutations';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';
import { useSession } from '../Session/SessionProvider';
import { TAXONOMY_ADMIN_SCOPE } from '../../constants';

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>;
  checked: boolean;
}

const StructureBanner = ({ onChange, checked }: Props) => {
  const { t } = useTranslation();
  const addNodeMutation = useAddNodeMutation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { userPermissions } = useSession();

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  const addNode = async (name: string) => {
    await addNodeMutation.mutateAsync({
      body: {
        name,
        nodeType: 'SUBJECT',
        root: true,
      },
      taxonomyVersion,
    });
  };

  return (
    <ResourceGroupBanner>
      <FlexWrapper>
        <StyledIcon />
        {t('taxonomy.editStructure')}
      </FlexWrapper>
      <FlexWrapper>
        <Switch
          onChange={onChange}
          checked={checked}
          label={t('taxonomy.favorites')}
          id={'favorites'}
        />
        {//TODO: implement addNode functionality! Delete InlineAddButton
        isTaxonomyAdmin && (
          <Button size="small">
            <>
              <Plus />
              {t('taxonomy.addSubject')}
            </>
          </Button>
        )

        /*<InlineAddButton title={t('taxonomy.addSubject')} action={addNode} />*/
        }
      </FlexWrapper>
    </ResourceGroupBanner>
  );
};

export default StructureBanner;
