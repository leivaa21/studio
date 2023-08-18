import styles from './user.module.scss';
import { useUserInfo } from '../../hooks/user/useUserInfo';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import { BsPersonFill } from 'react-icons/bs';
import { GetUserInfoResponse } from '@studio/commons';
import Button from '@studio/ui/components/interactivity/cta/button';
import { formatDate } from '../../utils/formatDate';
import { ChangeNicknameModal } from './changeNicknameModal';

export interface UserProfileViewParams {
  userId: string;
}

export function UserProfileView({ userId }: UserProfileViewParams) {
  const userInfo = useUserInfo(userId);
  const [changeNicknameModalShown, setChangeNicknameShown] =
    useState<boolean>(false);

  if (!userInfo) return <Fragment />;

  const canModifyNickname = userInfo.credentials.type !== 'GITHUB';

  return (
    <div className={styles.profileView}>
      <ul className={styles.properties}>
        <li className={styles.property}>
          <div className={styles.field}>
            <span className={styles.propertyTitle}>Nickname: </span>
            <span className={styles.propertyValue}>{userInfo.nickname}</span>
          </div>
          {canModifyNickname ? (
            <div className={styles.propertyControls}>
              <Button
                Label="Change Nickname"
                Size="Small"
                Type="Primary"
                onClick={() => setChangeNicknameShown(true)}
              />
            </div>
          ) : (
            <Fragment />
          )}
        </li>
        <li className={styles.property}>
          <div className={styles.field}>
            <span className={styles.propertyTitle}>Joined At: </span>
            <span className={styles.propertyValue}>
              {formatDate(new Date(userInfo.joinedAt))}
            </span>
          </div>
        </li>
        <GenericUserCredentials userInfo={userInfo} />
      </ul>
      <div className={styles.userControls}>
        <Button Label="Delete My Account" Type="Cancel" Size="Small" />
      </div>
      <ChangeNicknameModal
        isShown={changeNicknameModalShown}
        closeFunciton={() => setChangeNicknameShown(false)}
        currentNickname={userInfo.nickname}
      />
    </div>
  );
}

function GenericUserCredentials({
  userInfo,
}: {
  userInfo: GetUserInfoResponse;
}) {
  const renderCrendentialsIdentifier = () => {
    switch (userInfo.credentials.type) {
      case 'BASIC':
        return (
          <BasicCredentialsIdentifier email={userInfo.credentials.email} />
        );
      case 'GITHUB':
        return <GithubCredentialsIdentifier nickname={userInfo.nickname} />;
      case 'GOOGLE':
        return (
          <GoogleCredentialsIdentifier email={userInfo.credentials.email} />
        );
    }
  };

  const isBasicCredentials = userInfo.credentials.type === 'BASIC';

  return (
    <Fragment>
      <li className={styles.property}>
        <div className={styles.field}>
          <span className={styles.propertyTitle}>
            Credentials:{' '}
            <span className={styles.credentialsType}>
              ({userInfo.credentials.type.toLowerCase()})
            </span>
          </span>
          {renderCrendentialsIdentifier()}
        </div>
        {isBasicCredentials ? (
          <div className={styles.propertyControls}>
            <Button Label="Change Email" Size="Small" Type="Primary" />
          </div>
        ) : (
          <Fragment />
        )}
      </li>
      {isBasicCredentials ? (
        <li className={styles.property}>
          <div className={styles.changePasswordRow}>
            <Button Label="Change Password" Size="Small" Type="Primary" />
          </div>
        </li>
      ) : (
        <Fragment />
      )}
    </Fragment>
  );
}

function BasicCredentialsIdentifier({ email }: { email: string }) {
  return (
    <span className={styles.propertyValue}>
      <BsPersonFill
        className={styles.credentailsIcon}
        aria-label="Basic credentials"
      />
      {email}
    </span>
  );
}

function GithubCredentialsIdentifier({ nickname }: { nickname: string }) {
  return (
    <a
      href={`https://github.com/${nickname}`}
      target="_blank"
      rel="no-referrer noopener"
      className={styles.propertyValue}
    >
      <span className={styles.credentailsIcon}>
        <Image src={'/icons/github.svg'} alt="Github Credentials" fill />
      </span>
      {nickname}
    </a>
  );
}

function GoogleCredentialsIdentifier({ email }: { email: string }) {
  return (
    <span className={styles.propertyValue}>
      <span className={styles.credentailsIcon}>
        <Image src={'/icons/google.svg'} alt="Google Credentials" fill />
      </span>
      {email}
    </span>
  );
}
