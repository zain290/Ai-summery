import React from 'react';
import './LoadMoreButton.css';

interface LoadMoreButtonProps {
  loading: boolean;
  onClick: () => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ loading, onClick }) => {
  return (
    <button
      className={`lm-root ${loading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={loading}
      aria-label="Load More"
    >
      <span className="lm-icon" aria-hidden="true">
        <span className="lm-icon-core-center" />
        <span className="lm-icon-core-orbit">
          <span className="lm-icon-core-dot lm-icon-core-dot-1" />
          <span className="lm-icon-core-dot lm-icon-core-dot-2" />
          <span className="lm-icon-core-dot lm-icon-core-dot-3" />
          <span className="lm-icon-core-dot lm-icon-core-dot-4" />
        </span>
        <span className="lm-icon-orbit">
          <span className="lm-icon-orbit-dot lm-icon-orbit-dot-1" />
          <span className="lm-icon-orbit-dot lm-icon-orbit-dot-2" />
          <span className="lm-icon-orbit-dot lm-icon-orbit-dot-3" />
          <span className="lm-icon-orbit-dot lm-icon-orbit-dot-4" />
          <span className="lm-icon-orbit-dot lm-icon-orbit-dot-5" />
          <span className="lm-icon-orbit-dot lm-icon-orbit-dot-6" />
        </span>
      </span>
      <span className="lm-text" aria-hidden={loading}>Load More</span>
    </button>
  );
};

export default LoadMoreButton;
