import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BsPersonFill } from 'react-icons/bs';

import styles from './header.module.scss';

import { HeaderLinkType } from './types';
import { clearAuthTokenCookie } from '../../lib/cookieUtils';
import { useCurrentUser } from '../../hooks/user/useCurrentUser';

const Links: HeaderLinkType[] = [
  {
    page: 'All Courses 📚',
    href: '/courses',
    subLinks: [],
  },
  {
    page: 'My table 📖',
    href: '/dashboard',
    subLinks: [],
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
  const router = useRouter();
  const user = useCurrentUser();

  function logout() {
    clearAuthTokenCookie();
    router.push('/');
  }

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
            {user?.nickname}
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
      </ul>
    </header>
  );
}
