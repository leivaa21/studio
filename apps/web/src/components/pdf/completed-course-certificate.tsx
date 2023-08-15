import {
  Document,
  PDFDownloadLink,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer';
import { BsDownload } from 'react-icons/bs';

import styles from './pdf.module.scss';
import { useCurrentUser } from '../../hooks/user/useCurrentUser';
import { Fragment } from 'react';
import { useCourse } from '../../hooks/course/useCourse';

const styleSheet = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#ddd',
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    justifyItems: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  important: {
    fontSize: '30px',
    margin: '10px 0',
    fontWeight: 'bold',
  },
});

interface CompletedCourseCertificateParams {
  userName: string;
  courseTitle: string;
  date: Date;
}

function CompletedCourseCertificate({
  userName,
  courseTitle,
  date,
}: CompletedCourseCertificateParams) {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return (
    <Document>
      <Page style={styleSheet.page} orientation="landscape" size="A4">
        <Svg viewBox="0 0 1440 320">
          <Path
            fill="#2be86b"
            fill-opacity="1"
            d="M0,64L30,74.7C60,85,120,107,180,122.7C240,139,300,149,360,138.7C420,128,480,96,540,96C600,96,660,128,720,154.7C780,181,840,203,900,181.3C960,160,1020,96,1080,90.7C1140,85,1200,139,1260,154.7C1320,171,1380,149,1410,138.7L1440,128L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"
          />
        </Svg>
        <View style={styleSheet.content}>
          <Text>This certificate validates that</Text>
          <Text style={styleSheet.important}>{userName}</Text>
          <Text>Has succesfully completed the course</Text>
          <Text style={styleSheet.important}>{courseTitle}</Text>
          <Text>Finished {`${month}/${year}`}</Text>
        </View>
        <Svg viewBox="0 0 1440 320">
          <Path
            fill="#2be86b"
            fill-opacity="1"
            d="M0,64L30,74.7C60,85,120,107,180,122.7C240,139,300,149,360,138.7C420,128,480,96,540,96C600,96,660,128,720,154.7C780,181,840,203,900,181.3C960,160,1020,96,1080,90.7C1140,85,1200,139,1260,154.7C1320,171,1380,149,1410,138.7L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          />
        </Svg>
      </Page>
    </Document>
  );
}

export default function CompletedCourseCertificateLink({
  onClick,
  courseId,
}: {
  onClick: () => void;
  courseId: string;
}) {
  const user = useCurrentUser();
  const course = useCourse(courseId);

  if (!user || !course) return <Fragment />;

  return (
    <PDFDownloadLink
      fileName="Document"
      document={
        <CompletedCourseCertificate
          userName={user.nickname}
          courseTitle={course.title}
          date={new Date()}
        />
      }
      onClick={onClick}
      className={styles.certificateDownloader}
    >
      Download Certificate! <BsDownload />
    </PDFDownloadLink>
  );
}
