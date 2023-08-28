import { Fragment, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { PageMetadata } from '../../components/PageMetadata';
import { Header } from '../../components/header/header';
import { CreatorHeader } from '../../components/creator/header';
import { useErrorBoundary } from 'react-error-boundary';
import {
  GetUserStatsResponse,
  getUserStats,
} from '../../contexts/users/application/GetUserStats';

export default function AchivementsPage() {
  const router = useRouter();

  const [stats, setStats] = useState<GetUserStatsResponse>();

  const { showBoundary } = useErrorBoundary();

  const fetchData = useCallback(async () => {
    const token = getAuthTokenCookie();
    if (!token) return;
    try {
      const stats = await getUserStats(token);

      setStats(stats);
    } catch (err) {
      showBoundary(err);
    }
  }, [showBoundary]);

  useEffect(() => {
    if (!getAuthTokenCookie()) router.push('/');
    fetchData();
  }, [router, fetchData]);

  if (!stats) return <Fragment />;

  const renderStats = () => {
    if (!stats.authorStats && !stats.consumerStats) {
      return (
        <div className="row">
          <h1>No Stats to show</h1>
        </div>
      );
    }

    return (
      <div className="row">
        <div className="column">
          {stats.consumerStats ? (
            <span>Consumer stats</span>
          ) : (
            <span>Nothing to show as Consumer</span>
          )}
        </div>
        <div className="column">
          {stats.authorStats ? (
            <span>Author stats</span>
          ) : (
            <span>Nothing to show as Author</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <PageMetadata title="Studio | Achivements">
      <Fragment>
        <Header />
        <CreatorHeader title="User Achivements" />
        {renderStats()}
      </Fragment>
    </PageMetadata>
  );
}
