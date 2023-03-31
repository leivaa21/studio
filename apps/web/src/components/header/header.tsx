import Image from 'next/image';
import Link from 'next/link';
import { BsPersonFill, BsGearFill } from 'react-icons/bs';
import React, { useEffect } from 'react';

import styles from './header.module.scss';

import {
  clearAuthTokenCookie,
  getAuthTokenCookieDecoded,
} from '../../lib/cookieUtils';
import { HeaderLinkType } from './types';
import { useRouter } from 'next/router';

const Links: HeaderLinkType[] = [
  {
    page: 'All Courses 📚',
    href: '/courses',
    subLinks: [
      {
        name: '# New Courses!',
        href: '/courses?new=true',
      },
      {
        name: '# Typescript',
        href: '/courses?topic=typescript',
      },
    ],
  },
  {
    page: 'My table 📖',
    href: '/dashboard',
    subLinks: [
      {
        name: 'recent',
        href: '/courses?recent=true',
      },
    ],
  },
  {
    page: 'Creator Dashboard 🧩',
    href: '/creator',
    subLinks: [],
  },
  {
    page: 'Achivements 🏆',
    href: '/achivements',
    subLinks: [],
  },
];

export function HeaderLink(params: { link: HeaderLinkType; key: string }) {
  const { link, key } = params;
  return (
    <div className={styles.dropdown}>
      <Link href={link.href} className={styles['header-link']} key={key}>
        <li>{link.page}</li>
      </Link>
      <div className={styles['dropdown-content']}>
        {link.subLinks.map((subLink) => (
          <Link
            key={`${link.page} - ${subLink.name}`}
            className={styles['header-sublink']}
            href={`${link.href}${subLink.href}`}
          >
            {subLink.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const [name, setName] = React.useState<string>();

  const router = useRouter();

  function logout() {
    clearAuthTokenCookie();
    router.push('/');
  }

  useEffect(() => {
    setName(getAuthTokenCookieDecoded()?.nickname);
  }, []);

  return (
    <header className={styles.header}>
      <div className={`${styles['header-section']} ${styles['header-logo']}`}>
        <Image
          className={styles.logo}
          src="/branding/isotipo.svg"
          fill
          alt="Studio logo"
        />
      </div>
      <ul
        className={`${styles['header-section']} ${styles['header-section--left']}`}
      >
        {Links.map((link) => (
          <HeaderLink link={link} key={`Header link for ${link.page}`} />
        ))}
      </ul>
      <ul
        className={`${styles['header-section']} ${styles['header-section--right']}`}
      >
        <div className={styles.dropdown}>
          <li
            className={`${styles['header-settings']} ${styles['header-settings-profile']}`}
          >
            {name}
            <BsPersonFill className={styles['header-icon']} aria-hidden />
          </li>
          <ul
            className={`${styles['dropdown-content']} ${styles['header-settings-dropdown-content']}`}
          >
            <Link href="/profile">
              <li
                className={styles['header-settings-dropdown-content-setting']}
              >
                Profile
              </li>
            </Link>
            <li
              className={`${styles['header-settings-dropdown-content-setting']} ${styles['header-settings-logout']}`}
              onClick={logout}
            >
              Logout
            </li>
          </ul>
        </div>
        <div className={styles.dropdown}>
          <li
            className={`${styles['header-settings']} ${styles['header-settings-preferences']}`}
          >
            <BsGearFill className={styles['header-icon']} aria-hidden />
          </li>
          <ul
            className={`${styles['dropdown-content']} ${styles['header-settings-dropdown-content']}`}
          >
            <li className={styles['header-settings-dropdown-content-setting']}>
              Dark mode Switch
            </li>
            <li className={styles['header-settings-dropdown-content-setting']}>
              Lang Switch
            </li>
          </ul>
        </div>
      </ul>
    </header>
  );
}
