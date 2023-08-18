import { useState } from 'react';

import { ErrorMessage } from '@studio/ui/components/error/ErrorMessage';
import Button from '@studio/ui/components/interactivity/cta/button';
import { FormTextInput } from '@studio/ui/components/interactivity/form';
import { Modal } from '@studio/ui/components/modal';
import { ErrorCodes } from '@studio/commons';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { decodeError } from '../../lib/decodeError';

import styles from './user.module.scss';
import { changePassword } from '../../contexts/users/application/ChangePassword';

export interface ChangePasswordModalParams {
  isShown: boolean;
  closeFunciton: () => void;
}

export function ChangePasswordModal(props: ChangePasswordModalParams) {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmitUpdatePassword = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const request = {
      oldPassword,
      newPassword,
    };
    const token = getAuthTokenCookie();

    if (!token || oldPassword === '') return;

    try {
      await changePassword(request, token);
      props.closeFunciton();
    } catch (err) {
      if (
        (err as { errorCode: string }).errorCode ===
        ErrorCodes.InvalidCredential
      ) {
        setErrorMessage('Current password dont match!');
        return;
      }

      const errMessage = decodeError((err as { errorCode: string }).errorCode);
      setErrorMessage(errMessage);
    }
  };

  return (
    <Modal
      title="Change your password!"
      isShown={props.isShown}
      closeFunction={props.closeFunciton}
    >
      <div className={styles.modifyUserModal}>
        <ErrorMessage message={errorMessage} />
        <FormTextInput
          Name="Current Password"
          placeholder="Current Password"
          type="password"
          value={oldPassword}
          onChange={(e) => {
            setErrorMessage('');
            setOldPassword(e.currentTarget.value);
          }}
        />
        <FormTextInput
          Name="New Password"
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => {
            setErrorMessage('');
            setNewPassword(e.currentTarget.value);
          }}
        />
        <Button
          Type="Primary"
          Size="Small"
          Label="Update Password!"
          onClick={onSubmitUpdatePassword}
        />
      </div>
    </Modal>
  );
}
