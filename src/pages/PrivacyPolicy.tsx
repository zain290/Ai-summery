import React, { useEffect, useState } from 'react';
import SplitText from '../components/alpha/SplitText';
import ScrollReveal from '../components/alpha/ScrollReveal';
import Antigravity from '../components/alpha/Antigravity';
import { getPage } from '../controllers/apiController';
import SEO from '../components/alpha/SEO';
import './PrivacyPolicy.css';

const DEFAULT_PAGE = {
  hero_line1: 'Privacy Policy',
  hero_line2: 'Transparency & Trust',
  sections: [
    {
      label: 'Introduction',
      title: 'Respecting Your Privacy',
      paragraphs: [
        'At sum up, we are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.',
        'This privacy policy applies to all information collected through our website, mobile application, and/or any related services, sales, marketing, or events (collectively referred to as the "Services").',
        'When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy policy, we describe our privacy practices in the clearest way possible.'
      ],
    },
    {
      label: 'Information Collection',
      title: 'Information We Collect',
      paragraphs: [
        'We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website or otherwise when you contact us.',
        'The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use.',
      ],
      bullets: [
        'Account Information: Name, email address, password, and preferences.',
        'Payment Information: We collect data necessary to process your payment if you make purchases, such as your payment instrument number (handled securely by Stripe).',
        'Usage Data: Information about how you interact with our website, including your IP address, browser type, and operating system.',
        'User-Generated Content: The prompts you submit and the images generated are stored to provide you with your personal gallery.'
      ],
    },
    {
      label: 'Usage',
      title: 'How We Use Your Information',
      paragraphs: [
        'We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.',
        'Specifically, we use your information to:',
      ],
      bullets: [
        'Facilitate account creation and logon process.',
        'Fulfill and manage your orders, payments, returns, and exchanges.',
        'Improve our AI models and generation capabilities (anonymized data only).',
        'Send administrative information to you regarding your account or changes to our terms.',
        'Protect our Services from fraud or unauthorized access.'
      ]
    },
    {
      label: 'Cookies & Tracking',
      title: 'Cookies and Similar Technologies',
      paragraphs: [
        'We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.',
        'These technologies help us understand user behavior, remember your preferences, and improve the overall performance of the sum up platform.'
      ],
    },
    {
      label: 'Third Parties',
      title: 'Sharing Your Information',
      paragraphs: [
        'We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.',
        'We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work (e.g., payment processing, data analysis, email delivery, hosting services).',
        'We do not sell, rent or share your personal information with third parties for their marketing purposes.',
      ],
    },
    {
      label: 'User Rights',
      title: 'Your Privacy Rights',
      paragraphs: [
        'Depending on where you reside, you may have rights regarding your personal information, including the right to request access to the data we collect from you, change that information, or delete it in some circumstances.',
        'If you would like to review, update, or delete your personal information, please submit a request to our support team. We will respond to your request within 30 days.'
      ],
    },
    {
      label: 'Security',
      title: 'Keeping Your Information Safe',
      paragraphs: [
        'We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please remember that the internet itself cannot be guaranteed to be 100% secure.',
        'Although we will do our best to protect your personal information, transmission of personal information to and from our Website is at your own risk. You should only access the Website within a secure environment.',
      ],
    },
  ],
};

const formatUpdatedAt = (value?: string | null) =>
  new Date(value || Date.now()).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const PrivacyPolicy: React.FC = () => {
  const [pageData, setPageData] = useState(DEFAULT_PAGE);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    getPage('privacy-policy')
      .then((page: any) => {
        setPageData({
          ...DEFAULT_PAGE,
          ...page.content,
          sections: page.content?.sections || DEFAULT_PAGE.sections,
        });
        setUpdatedAt(page.updated_at || null);
      })
      .catch((err: any) => {
        console.error('Privacy page load error:', err);
      });
  }, []);

  return (
    <div className="privacy-container">
      <SEO
        title="sum up | Privacy Policy"
        description={`${pageData.hero_line1} - ${pageData.hero_line2}`}
        canonicalUrl="https://sum up.app/privacy-policy"
      />
      <section className="privacy-hero-section">
        <div className="antigravity-wrapper" style={{ opacity: 0.8 }}>
          <Antigravity color="var(--color-text)" count={80} magnetRadius={12} fieldStrength={10} particleSize={1.2} autoAnimate={true} />
        </div>
        <div className="max-container">
          <h1 className="hero-title">
            <span className="hero-line-1">
              <SplitText text={pageData.hero_line1} delay={30} animationFrom={{ opacity: 0, transform: 'translate3d(0,40px,0)' }} animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }} />
            </span>
            <span className="hero-line-2">
              <SplitText text={pageData.hero_line2} delay={30} animationFrom={{ opacity: 0, transform: 'translate3d(0,40px,0)' }} animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }} />
            </span>
          </h1>
        </div>
      </section>

      <section className="privacy-content-section">
        {pageData.sections.map((section, index) => (
          <div key={`${section.title}-${index}`} className="privacy-block">
            <ScrollReveal y={20} delay={0.1}>
              <span className="privacy-label">{section.label}</span>
              <h2>{section.title}</h2>
              <div className="privacy-text">
                {(section.paragraphs || []).map((paragraph: string, paragraphIndex: number) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
                {section.bullets?.length ? (
                  <ul>
                    {section.bullets.map((bullet: string, bulletIndex: number) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </ScrollReveal>
          </div>
        ))}

        <div className="last-updated">
          <p>Last updated: {formatUpdatedAt(updatedAt)}</p>
        </div>
      </section>
      <div className="pb-20 md:pb-40"></div>
    </div>
  );
};

export default PrivacyPolicy;
