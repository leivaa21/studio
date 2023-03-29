import React from 'react';

import Button from '@studio/ui/components/interactivity/cta/button';
import Form, {
  FormBody,
  FormTextInput,
  FormHeader,
  FormHint,
} from '@studio/ui/components/interactivity/form';
import Link from 'next/link';
import { internalApiClient } from '../../../lib/InternalApiClient';
import { setAuthTokenCookie } from '../../../lib/cookieUtils';
import { useRouter } from 'next/router';
import { decodeError } from '../../../lib/decodeError';

export const SignInForm = () => {
  const [errMessage, setErrMessage] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const router = useRouter();

  const onSubmitSignIn = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const body = {
      email,
      password,
    };

    try {
      const response = await internalApiClient.post(`/api/auth/signin`, body);
      setAuthTokenCookie((response as { token: string }).token);
      router.push('/panel');
    } catch (err) {
      console.error(err);
      const errorMessage = decodeError(
        (err as { errorCode: string }).errorCode
      );
      setErrMessage(errorMessage);
    }
  };

  return (
    <Form style={{ width: '100%' }}>
      <FormHeader>
        <h1>
          <b>Join now</b> and get access to <b>all</b> the courses!🚀
        </h1>
      </FormHeader>
      <FormBody>
        <span style={{ color: 'red', height: '4rem' }}>{errMessage}</span>
        <FormTextInput
          Name="Email"
          placeholder="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <FormTextInput
          Name="Password"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Button
          Label="sign in!"
          Size="Medium"
          Type="Primary"
          onClick={onSubmitSignIn}
        />
        <FormHint>
          <p>You dont have account yet?</p>
          <Link href="/singup" style={{ cursor: 'pointer' }}>
            Sing up here!
          </Link>
        </FormHint>
      </FormBody>
    </Form>
  );
};
