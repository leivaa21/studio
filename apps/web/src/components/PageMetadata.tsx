import Head from 'next/head';
import { Fragment } from 'react';

export interface PageMetadataParams {
  children: JSX.Element;
  title: string;
  description?: string;
  keywords?: string[];
}

export function PageMetadata({
  children,
  title,
  description,
  keywords,
}: PageMetadataParams) {
  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords.join(', ')} />}
        {/** TODO: Cambiar la URL en prod*/}
        <link rel="canonical" href="http://localhost" />

        <link rel="icon" href="/branding/isotipo.svg" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2be86b" />
      </Head>
      {children}
    </Fragment>
  );
}
