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
import { CurrentConsumerStatsView } from '../../components/stats/ConsumerStats';
import { CurrentAuthorStatsView } from '../../components/stats/AuthorStats';
import { NoStatsToShow } from '../../components/stats/NoStatsToShow';

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
          <NoStatsToShow message="No Stats to Show" />
        </div>
      );
    }

    return (
      <div className="row">
        <div className="column">
          {stats.consumerStats ? (
            <CurrentConsumerStatsView stats={stats.consumerStats} />
          ) : (
            <NoStatsToShow message="Nothing to show as Consumer" />
          )}
        </div>
        <div className="column">
          {stats.authorStats ? (
            <CurrentAuthorStatsView stats={stats.authorStats} />
          ) : (
            <NoStatsToShow message="Nothing to show as Author" />
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
