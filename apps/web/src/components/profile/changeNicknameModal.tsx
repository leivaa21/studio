import { useState } from 'react';
import { useRouter } from 'next/router';

import { ErrorMessage } from '@studio/ui/components/error/ErrorMessage';
import Button from '@studio/ui/components/interactivity/cta/button';
import { FormTextInput } from '@studio/ui/components/interactivity/form';
import { Modal } from '@studio/ui/components/modal';

import { renameUser } from '../../contexts/users/application/RenameUser';
import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { decodeError } from '../../lib/decodeError';

import styles from './user.module.scss';

export interface ChangeNicknameModalParams {
  isShown: boolean;
  closeFunciton: () => void;
  currentNickname: string;
}

export function ChangeNicknameModal(props: ChangeNicknameModalParams) {
  const router = useRouter();
  const [nickname, setNickname] = useState<string>(props.currentNickname);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmitUpdateNickname = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const request = {
      nickname,
    };
    const token = getAuthTokenCookie();

    if (!token || nickname === '') return;

    try {
      await renameUser(request, token);
      props.closeFunciton();
      router.reload();
    } catch (err) {
      const errMessage = decodeError((err as { errorCode: string }).errorCode);
      setErrorMessage(errMessage);
    }
  };

  return (
    <Modal
      title="Change your nickname!"
      isShown={props.isShown}
      closeFunction={props.closeFunciton}
    >
      <div className={styles.modifyUserModal}>
        <ErrorMessage message={errorMessage} />
        <FormTextInput
          Name="User nickname"
          placeholder="Nickname"
          type="text"
          value={nickname}
          onChange={(e) => {
            setErrorMessage('');
            setNickname(e.currentTarget.value);
          }}
        />
        <Button
          Type="Primary"
          Size="Small"
          Label="Update nickname!"
          onClick={onSubmitUpdateNickname}
        />
      </div>
    </Modal>
  );
}
