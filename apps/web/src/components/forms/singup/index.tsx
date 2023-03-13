import React from "react";

import Button from "@studio/ui/components/interactivity/cta/button";
import Form, {FormBody, FormTextInput, FormHeader, FormHint} from '@studio/ui/components/interactivity/form';

import styles from './singup.module.scss'
import Link from "next/link";

export const SignUpForm = () => {
  const [nickname, setNickname] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const onSubmitSignUp = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    console.log({nickname, email, password})
  }

  return (
    <Form className={styles.SingUpForm}>
      <FormHeader>
        <h1><b>Join now</b> and get access to <b>all</b> the courses!🚀</h1>
      </FormHeader>
      <FormBody>
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