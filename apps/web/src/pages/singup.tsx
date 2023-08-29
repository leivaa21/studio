import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SignUpForm } from '../components/forms/singup';
import { getAuthTokenCookie } from '../lib/cookieUtils';
import { PageMetadata } from '../components/PageMetadata';

export default function SingUp() {
  const router = useRouter();
  useEffect(() => {
    if (getAuthTokenCookie()) {
      router.push('/courses');
    }
  });

  return (
    <PageMetadata title="Studio | Sign up now!">
      <SignUpForm />
    </PageMetadata>
  );
}
