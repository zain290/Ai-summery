import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/alpha/ScrollReveal';
import SplitText from '../components/alpha/SplitText';
import Antigravity from '../components/alpha/Antigravity';
import ProjectThumbnailSection, { type ProjectThumbnail } from '../components/alpha/ProjectThumbnailSection';
import { getPage, getProjects } from '../controllers/apiController';
import SEO from '../components/layout/SEO';
import './About.css';

const DEFAULTS = {
  hero_line1: 'About sum up',
  hero_line2: 'Resume Analyzer.',
  products_title: 'Your Career, Powered by AI',
  products_paragraphs: [
    "We believe that a great resume is the key to unlocking your career potential. AI isn't here to write your history—it's here to ensure your achievements are seen and understood by top companies.",
    "Built from the ground up, sum up uses the renowned Google XYZ formula to score and refine your bullet points. By analyzing the job description you provide, we ensure your resume aligns perfectly with what recruiters are looking for.",
    "Whether you're a recent graduate or a seasoned professional, our tool helps you bridge the gap between your experience and the job requirements. Upload your resume, paste the target job description, and get immediate, actionable insights.",
    "Your data stays private. We don't store your resumes. We just give you the competitive edge you need in today's job market."
  ],
  services_items: ['Instant Resume Scoring', 'Keyword Matching', 'Google XYZ Formula Analysis', 'Actionable Rewrite Suggestions', 'ATS Optimization', 'Privacy First'],
  faqs: [
    { question: 'How do I use the analyzer?', answer: 'Simply head over to the Home page, upload your PDF or DOCX resume, paste the job description you are targeting, and click Analyze.' },
    { question: 'Is my data secure?', answer: 'Yes! Your resumes are analyzed in memory and immediately discarded. We do not store or share your personal data.' },
    { question: 'What is the Google XYZ formula?', answer: 'It is a proven method for writing resume bullets: "Accomplished [X] as measured by [Y], by doing [Z]." Our AI checks your bullets against this standard.' },
    { question: 'Do I have to pay to use this?', answer: 'No, sum up is completely free to use for job seekers.' },
  ],
  cta_title: "Start optimizing today.",
  cta_button_text: 'Analyze Resume',
  cta_button_link: '/',
};

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageData, setPageData] = useState(DEFAULTS);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<ProjectThumbnail[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    getPage('about').then(d => {
      if (d?.content) setPageData({ ...DEFAULTS, ...d.content });
    }).catch(() => { });

    getProjects().then((data: any) => {
      if (Array.isArray(data)) setProjects(data);
    }).catch(() => { })
      .finally(() => setIsLoadingProjects(false));

  }, []);

  return (
    <div ref={containerRef} className="about-container">
      <SEO 
        title={`About Us | ${pageData.hero_line1}`} 
        description={`${pageData.hero_line1} ${pageData.hero_line2}`} 
        canonicalUrl={window.location.origin + '/about'}
      />
      <section className="about-hero-section">
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

      <section className="products-section">
        <div className="max-container">
          <div className="products-header">
            <h2 className="products-title">
              <SplitText text={pageData.products_title} delay={40} animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }} animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }} />
            </h2>
            <div className="products-content">
              {pageData.products_paragraphs.map((para, i) => (
                <ScrollReveal key={i} y={30} delay={0.1}>
                  <p className="products-description">{para}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="scope-section">
        <div className="max-container">
          <div className="scope-header">
            <h2 className="project-info-label">
              <SplitText text="Services" delay={50} animationFrom={{ opacity: 0, transform: 'translate3d(0,20px,0)' }} animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }} textAlign="left" />
            </h2>
          </div>
          <div className="scope">
            <ul className="service-list">
              {pageData.services_items.map((item, i) => (
                <li key={i} className="service-item">
                  <span className="item-text">{item}</span>
                  <span className="item-number">{(i + 1).toString().padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ProjectThumbnailSection projects={projects} startIndex={0} isLoading={isLoadingProjects} />

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="max-container">
          <div className="faq-header">
            <h2 className="project-info-label">
              <SplitText text="FAQ" delay={50} animationFrom={{ opacity: 0, transform: 'translate3d(0,20px,0)' }} animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }} textAlign="left" />
            </h2>
          </div>
          <div className="faq-list">
            {pageData.faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${activeIndex === i ? 'active' : ''}`}
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                onMouseEnter={() => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)}>
                <div className="faq-question">
                  <span className="item-text">{faq.question}</span>
                  <span className="item-number">{(i + 1).toString().padStart(2, '0')}</span>
                </div>
                <motion.div className="faq-answer-wrapper" initial={false}
                  animate={{ height: activeIndex === i ? 'auto' : 0, opacity: activeIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                  <div className="faq-answer"><p>{faq.answer}</p></div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <div className="pb-20 md:pb-40"></div>
    </div>
  );
};

export default About;
