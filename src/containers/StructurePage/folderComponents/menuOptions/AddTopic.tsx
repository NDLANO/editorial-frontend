import { useTranslation } from 'react-i18next';

import { Plus } from '@ndla/icons/action';
import { addTopic, addTopicToTopic } from '../../../../modules/taxonomy';
import RoundIcon from '../../../../components/RoundIcon';

import MenuItemButton from './MenuItemButton';
import MenuItemEditField from './MenuItemEditField';

import { EditMode } from '../../../../interfaces';

type Props = {
  id: string;
  numberOfSubtopics: number;
  refreshTopics: () => void;
  onClose: () => void;
  editMode: string;
  toggleEditMode: (mode: EditMode) => void;
};
const AddTopic = ({
  id,
  numberOfSubtopics,
  refreshTopics,
  onClose,
  editMode,
  toggleEditMode,
}: Props) => {
  const { t } = useTranslation();

  const onAddSubTopic = async (name: string) => {
    const newPath = await addTopic({ name });
    if (!newPath) {
      throw Error('Invalid topic path returned');
    }

    const newId = newPath.replace('/v1/topics/', '');
    await addTopicToTopic({
      subtopicid: newId,
      topicid: id,
      primary: true,
      rank: numberOfSubtopics + 1,
    });
    refreshTopics();
  };

  if (editMode === 'addTopic') {
    return (
      <MenuItemEditField
        placeholder={t('taxonomy.newTopic')}
        currentVal=""
        messages={{ errorMessage: t('taxonomy.errorMessage') }}
        onClose={onClose}
        onSubmit={onAddSubTopic}
        icon={<Plus />}
      />
    );
  }
  return (
    <MenuItemButton stripped onClick={() => toggleEditMode('addTopic')}>
      <RoundIcon small icon={<Plus />} />
      {t('taxonomy.addTopic')}
    </MenuItemButton>
  );
};

export default AddTopic;
