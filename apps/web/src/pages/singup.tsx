import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import { SignUpForm } from '../components/forms/singup';
import { getAuthTokenCookie } from '../lib/cookieUtils';

export default function SingUp() {
  const router = useRouter();
  useEffect(() => {
    if (getAuthTokenCookie()) {
      router.push('/panel');
    }
  });

  return (
    <Fragment>
      <Head>
        <title>Sign Up now!</title>
      </Head>
      <main>
        <SignUpForm />
      </main>
    </Fragment>
  );
}
