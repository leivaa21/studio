import React from "react";

import Button from "@studio/ui/components/interactivity/cta/button";
import Form, {FormBody, FormTextInput, FormHeader, FormHint} from '@studio/ui/components/interactivity/form';

export const SignInForm = () => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  return (
    <Form style={{ width: '450px' }}>
      <FormHeader>
        <h1><b>Join now</b> and get access to <b>all</b> the courses!🚀</h1>
      </FormHeader>
      <FormBody>
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
        <Button Label="sign in!" Size="Medium" Type="Primary" />
        <FormHint>
          <p>You dont have account yet?</p>
          <a style={{ cursor: 'pointer' }}>Sing up here!</a>
        </FormHint>
      </FormBody>
    </Form>
  )
}