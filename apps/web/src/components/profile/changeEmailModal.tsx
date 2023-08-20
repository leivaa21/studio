import { useState } from 'react';

import { ErrorMessage } from '@studio/ui/components/error/ErrorMessage';
import Button from '@studio/ui/components/interactivity/cta/button';
import { FormTextInput } from '@studio/ui/components/interactivity/form';
import { Modal } from '@studio/ui/components/modal';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { decodeError } from '../../lib/decodeError';

import styles from './user.module.scss';
import { changeEmail } from '../../contexts/users/application/ChangeEmail';

export interface ChangeEmailModalParams {
  isShown: boolean;
  closeFunciton: () => void;
  currentEmail: string;
  fetchFunction: () => Promise<void>;
}

export function ChangeEmailModal(props: ChangeEmailModalParams) {
  const [email, setEmail] = useState<string>(props.currentEmail);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmitUpdateEmail = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const request = {
      email,
    };
    const token = getAuthTokenCookie();

    if (!token || email === '') return;

    try {
      await changeEmail(request, token);
      await props.fetchFunction();
      props.closeFunciton();
    } catch (err) {
      const errMessage = decodeError((err as { errorCode: string }).errorCode);
      setErrorMessage(errMessage);
    }
  };

  return (
    <Modal
      title="Change your email!"
      isShown={props.isShown}
      closeFunction={props.closeFunciton}
    >
      <div className={styles.modifyUserModal}>
        <ErrorMessage message={errorMessage} />
        <FormTextInput
          Name="User email"
          placeholder="Email"
          type="text"
          value={email}
          onChange={(e) => {
            setErrorMessage('');
            setEmail(e.currentTarget.value);
          }}
        />
        <Button
          Type="Primary"
          Size="Small"
          Label="Update email!"
          onClick={onSubmitUpdateEmail}
        />
      </div>
    </Modal>
  );
}
