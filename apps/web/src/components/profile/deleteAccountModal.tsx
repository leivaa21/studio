import { useState } from 'react';
import { useRouter } from 'next/router';

import { ErrorMessage } from '@studio/ui/components/error/ErrorMessage';
import Button from '@studio/ui/components/interactivity/cta/button';
import { Modal } from '@studio/ui/components/modal';

import {
  clearAuthTokenCookie,
  getAuthTokenCookie,
} from '../../lib/cookieUtils';
import { decodeError } from '../../lib/decodeError';

import styles from './user.module.scss';
import { deleteAccount } from '../../contexts/users/application/DeleteAccount';

export interface DeleteAccountModalParams {
  isShown: boolean;
  closeFunciton: () => void;
}

export function DeleteAccountModal(props: DeleteAccountModalParams) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmitUpdateNickname = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const token = getAuthTokenCookie();

    if (!token) return;

    try {
      await deleteAccount(token);
      props.closeFunciton();
      clearAuthTokenCookie();
      router.push('/');
    } catch (err) {
      const errMessage = decodeError((err as { errorCode: string }).errorCode);
      setErrorMessage(errMessage);
    }
  };

  return (
    <Modal
      title="Are you sure to delete your account? (All content will dissapear)"
      isShown={props.isShown}
      closeFunction={props.closeFunciton}
    >
      <div className={styles.modifyUserModal}>
        <ErrorMessage message={errorMessage} />
        <Button
          Type="Cancel"
          Size="Small"
          Label="Delete this account"
          onClick={onSubmitUpdateNickname}
        />
      </div>
    </Modal>
  );
}
