/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect } from 'react';
import styles from '../styles/Home.module.scss';
import { SignInForm } from '../components/forms/signin';
import { Logobar } from '../components/home/LogoBar';
import { useRouter } from 'next/router';
import { getAuthTokenCookie } from '../lib/cookieUtils';

import { Metadata } from 'next';
import { PageMetadata } from '../components/PageMetadata';

export const metadata: Metadata = {
  title: 'Studio',
  description: 'STUDIO WEB',
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (getAuthTokenCookie()) {
      router.push('/courses');
    }
  });

  return (
    <PageMetadata title="Studio | Your course platform">
      <Fragment>
        <Logobar />
        <div className="maxWidthWrapper">
          <div className={styles['particles-wrapper']}>
            <img
              className={`${styles.particle} ${styles['particle-first']}`}
              alt=""
              src="/assets/particle1.svg"
            />
            <img
              className={`${styles.particle} ${styles['particle-second']}`}
              alt=""
              src="/assets/particle2.svg"
            />
          </div>
          <section id="hero" className={styles['hero-wrapper']}>
            <div
              id="bubbles-wrapper"
              className={styles['hero-bubbles-wrapper']}
            >
              <div className={`${styles.bubble} ${styles['bubble--first']}`}>
                <ul className="no-dotted-list">
                  <li>
                    <strong>Open</strong> source
                  </li>
                  <li>
                    <strong>Easy</strong> to use
                  </li>
                  <li>
                    <strong>Free</strong> of charges!
                  </li>
                  <li>
                    <span className={styles['bubble-icon']}>💸</span>
                  </li>
                </ul>
              </div>
              <div className={`${styles.bubble} ${styles['bubble--second']}`}>
                <div className={styles['second-bubble-text-wrapper']}>
                  <span>
                    <strong>+10</strong>
                  </span>
                  <p>Courses</p>
                  <span className={styles['bubble-icon']}>🆙</span>
                </div>
              </div>
              <div className={`${styles.bubble} ${styles['bubble--third']}`}>
                <div>
                  <p>
                    <strong>Grow</strong> & <strong>help</strong> others to grow
                    by <strong>contributing</strong> with your knowledge!
                  </p>
                  <span className={styles['bubble-icon']}>🫂</span>
                </div>
              </div>
            </div>

            <div id="signIn-wrapper" className={styles['hero-signIn-wrapper']}>
              <SignInForm />
            </div>
          </section>
        </div>
      </Fragment>
    </PageMetadata>
  );
}
