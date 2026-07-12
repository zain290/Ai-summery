import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  type?: string;
  imageUrl?: string;
  schemaMarkup?: string;
  noindex?: boolean;
}

export default function SEO({ title, description, canonicalUrl, type = 'website', imageUrl, schemaMarkup, noindex = false }: SEOProps) {
  const defaultImage = '/assets/hero.png';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl || defaultImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl || defaultImage} />
      {schemaMarkup && (
        <script type="application/ld+json">{schemaMarkup}</script>
      )}
    </Helmet>
  );
}