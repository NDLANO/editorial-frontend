/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IconButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@ndla/modal';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Path, Transforms } from 'slate';
import { CampaignBlockEmbedData } from '@ndla/types-embed';
import styled from '@emotion/styled';
import { CampaignBlock } from '@ndla/ui';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { CampaignBlockElement } from '.';
import DeleteButton from '../../../DeleteButton';
import { fetchImage } from '../../../../modules/image/imageApi';
import CampaignBlockForm from './CampaignBlockForm';
import { StyledFigureButtons } from '../embed/FigureButtons';

interface Props extends RenderElementProps {
  element: CampaignBlockElement;
  editor: Editor;
}
const CampaignBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    width: 100%;

    &:first-child {
      position: relative;
    }
  }
`;

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0px;
`;

const StyledModalBody = styled(ModalBody)`
  padding-top: 0px;
  h2 {
    margin: 0px;
  }
`;

const SlateCampaignBlock = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const campaignBlock = element.data;
  const [leftImage, setLeftImage] = useState<IImageMetaInformationV3 | undefined>(undefined);
  const [rightImage, setRightImage] = useState<IImageMetaInformationV3 | undefined>(undefined);

  const onClose = useCallback(() => {
    ReactEditor.focus(editor);
    setIsEditing(false);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
    }
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  }, [editor, element]);

  const onSave = useCallback(
    (data: CampaignBlockEmbedData) => {
      setIsEditing(false);
      const properties = {
        data: data,
        isFirstEdit: false,
      };

      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, properties, { at: path });

      if (Editor.hasPath(editor, Path.next(path))) {
        setTimeout(() => {
          Transforms.select(editor, Path.next(path));
        }, 0);
      }
    },
    [setIsEditing, editor, element],
  );

  useEffect(() => {
    if (campaignBlock?.imageBeforeId) {
      fetchImage(campaignBlock.imageBeforeId).then((img) => setLeftImage(img));
    } else {
      setLeftImage(undefined);
    }
    if (campaignBlock?.imageAfterId) {
      fetchImage(campaignBlock.imageAfterId).then((img) => setRightImage(img));
    } else {
      setRightImage(undefined);
    }
  }, [campaignBlock?.imageAfterId, campaignBlock?.imageBeforeId]);
  //
  const handleRemove = useCallback(
    () =>
      Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true }),
    [editor, element],
  );

  return (
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <CampaignBlockWrapper {...attributes}>
        {campaignBlock && (
          <div contentEditable={false}>
            <StyledFigureButtons data-white={true}>
              <ModalTrigger>
                <IconButtonV2
                  variant="ghost"
                  aria-label={t('contactBlockForm.edit')}
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil />
                </IconButtonV2>
              </ModalTrigger>
              <DeleteButton aria-label={t('delete')} onClick={handleRemove} />
            </StyledFigureButtons>
            <CampaignBlock
              title={{ title: campaignBlock.title, language: campaignBlock.titleLanguage }}
              description={{
                text: campaignBlock.description,
                language: campaignBlock.descriptionLanguage,
              }}
              headingLevel={campaignBlock.headingLevel}
              url={{ url: campaignBlock.url, text: campaignBlock.urlText }}
              imageBefore={
                leftImage && { src: leftImage.image.imageUrl, alt: leftImage.alttext.alttext }
              }
              imageAfter={
                rightImage && { src: rightImage.image.imageUrl, alt: rightImage.alttext.alttext }
              }
            />
          </div>
        )}
        {children}
        <ModalContent size={{ width: 'large', height: 'full' }}>
          <StyledModalHeader>
            <ModalTitle>{t('campaignBlockForm.title')}</ModalTitle>
            <ModalCloseButton />
          </StyledModalHeader>
          <StyledModalBody>
            <CampaignBlockForm initialData={campaignBlock} onSave={onSave} onCancel={onClose} />
          </StyledModalBody>
        </ModalContent>
      </CampaignBlockWrapper>
    </Modal>
  );
};

export default SlateCampaignBlock;
