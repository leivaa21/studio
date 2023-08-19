import { FallbackProps } from 'react-error-boundary';

import Button from '@studio/ui/components/interactivity/cta/button';

import { PageMetadata } from '../PageMetadata';
import { CreatorHeader } from '../creator/header';
import { Fragment, useEffect, useState } from 'react';
import { Header } from '../header/header';
import { decodeError } from '../../lib/decodeError';

import styles from './error.module.scss';

export function ShowErrorBoundary(props: FallbackProps) {
  const { error, resetErrorBoundary } = props;

  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!error.errorCode) {
      setErrorMessage(error.message);
      return;
    }

    setErrorMessage(decodeError(error.errorCode));
  }, [setErrorMessage, error]);

  return (
    <PageMetadata title="Studio | Whoops something occurred!">
      <Fragment>
        <Header />
        <CreatorHeader title="🆘 Something went wrong 🆘" />
        <div className="column maxWidthWrapper" style={{ padding: '5vh 5vw' }}>
          <div className={styles.info}>
            <h2 className={styles.title}>Error ocurred!</h2>
            <h4 className={styles.errorMessage}>{errorMessage}</h4>
          </div>
          <div className={styles.errorPageControls}>
            <Button
              Label="Reload"
              Type="Primary"
              Size="Medium"
              onClick={resetErrorBoundary}
            />
          </div>
        </div>
      </Fragment>
    </PageMetadata>
  );
}
