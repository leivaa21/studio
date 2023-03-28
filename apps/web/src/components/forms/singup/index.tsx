import React from "react";

import Button from "@studio/ui/components/interactivity/cta/button";
import Form, {FormBody, FormTextInput, FormHeader, FormHint} from '@studio/ui/components/interactivity/form';

import styles from './singup.module.scss'
import Link from "next/link";
import { internalApiClient } from "../../../lib/InternalApiClient";
import { decodeError } from "../../../lib/decodeError";
import { useRouter } from "next/router";
import { setAuthTokenCookie } from "../../../lib/cookieUtils";

export const SignUpForm = () => {
  const [errMessage, setErrMessage] = React.useState<string>('');
  const [nickname, setNickname] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const router = useRouter();

  const onSubmitSignUp = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const body = {
      nickname,
      credentials: {
        email,
        password,
      }
    }

    try {
      const response = await internalApiClient.post(`/api/auth/signup`, body );
      setAuthTokenCookie((response as { token:string }).token);
      router.push('/panel');

    } catch(err) {
      console.error(err);
      const errorMessage = decodeError((err as {errorCode: string}).errorCode);
      setErrMessage(errorMessage);

    }

  }

  return (
    <Form className={styles.SingUpForm}>
      <FormHeader>
        <h1><b>Join now</b> and get access to <b>all</b> the courses!🚀</h1>
      </FormHeader>
      <FormBody onChange={(e) => setErrMessage('')}>
        <span style={{color: 'red', height:'1.5rem'}}>{errMessage}</span>
        <FormTextInput
          Name="Nickname"
          placeholder="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.currentTarget.value)}
        />
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
        <Button Label="sign up!" Size="Medium" Type="Primary" onClick={onSubmitSignUp} />
        <FormHint>
          <p>Missclicked here?, go back!</p>
          <Link href="/" style={{ cursor: 'pointer' }}>Back to landing page!</Link>
        </FormHint>
      </FormBody>
    </Form>
  )
}