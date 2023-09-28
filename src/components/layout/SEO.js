import Head from 'next/head';

const SEO = ({ title, description, keywords, author }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      {/* Add other SEO-related meta tags here */}
    </Head>
  );
};

export default SEO;
