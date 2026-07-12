import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

export type ProjectThumbnail = {
  slug: string;
  name: string;
  hero_image?: string;
  orbit_image?: string;
};

type ProjectThumbnailSectionProps = {
  projects: ProjectThumbnail[];
  startIndex?: number;
  isLoading?: boolean;
};

function getVisibleProjects(projects: ProjectThumbnail[], startIndex: number) {
  if (projects.length === 0) return [];

  const slice = projects.slice(startIndex, startIndex + 2);
  if (slice.length > 0) return slice;

  return projects.slice(0, Math.min(2, projects.length));
}

const ProjectThumbnailSection: React.FC<ProjectThumbnailSectionProps> = ({
  projects,
  startIndex = 0,
  isLoading = false,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const navigate = useNavigate();

  const visibleProjects = useMemo(
    () => getVisibleProjects(projects, startIndex),
    [projects, startIndex]
  );

  // Render a placeholder skeleton to prevent CLS while loading
  if (isLoading || (projects.length === 0 && isLoading !== false)) {
    return (
      <section className="image-expand-section" aria-hidden="true">
        <div className="image-expand-container">
          {[1, 2].map((i) => (
            <div key={i} className="expand-column" style={{ flex: 1, pointerEvents: 'none' }}>
              <div className="image-container-inner" style={{ opacity: 0.05, backgroundColor: 'currentColor' }}></div>
              <div className="expand-caption">
                <div style={{ height: '14px', width: '40%', backgroundColor: 'currentColor', opacity: 0.05, marginTop: '8px', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (visibleProjects.length === 0) return null;

  return (
    <section className="image-expand-section">
      <ScrollReveal y={60} duration={1.5} delay={0} start="top 95%">
        <div className="image-expand-container">
          {visibleProjects.map((project, i) => {
            const imageSrc = project.hero_image || project.orbit_image || '/assets/hero.png';
            const displayNumber = (startIndex + i + 1).toString().padStart(2, '0');

            return (
              <motion.div
                key={project.slug}
                className="expand-column"
                animate={{ flex: hovered === i ? 1.24 : hovered !== null ? 0.76 : 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => navigate(`/work/${project.slug}`)}
              >
                <div className="image-container-inner">
                  <img src={imageSrc} alt={project.name} />
                </div>
                <div className="expand-caption">
                  <h3 className="expand-title">{displayNumber}. {project.name}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default ProjectThumbnailSection;
