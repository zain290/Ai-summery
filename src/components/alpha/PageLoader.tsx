import { AnimatePresence, motion } from 'framer-motion';
import './PageLoader.css';

type PageLoaderProps = {
  visible: boolean;
  theme: 'light' | 'dark';
};

const orbitAngles = [0, 60, 120, 180, 240, 300];

export default function PageLoader({ visible, theme }: PageLoaderProps) {
  const dotColor = theme === 'dark' ? '#ffffff' : '#111111';
  const accentColor = theme === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(17,17,17,0.14)';
  const animationAsset = theme === 'dark' ? '/lottie/Cosmos-dark.json' : '/lottie/Cosmos-light.json';

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="page-loader"
          className="page-loader"
          aria-live="polite"
          aria-busy="true"
          data-theme={theme}
          data-animation={animationAsset}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
        >
          <motion.div
            className="page-loader-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="page-loader-ring page-loader-ring-primary"
              animate={{ rotate: 360 }}
              transition={{ rotate: { duration: 4.4, ease: 'linear', repeat: Infinity } }}
            >
              {orbitAngles.map((angle, index) => (
                <motion.span
                  key={`primary-${angle}`}
                  className="page-loader-dot"
                  style={{ backgroundColor: dotColor, transform: `rotate(${angle}deg) translateY(-56px)` }}
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity, delay: index * 0.12 }}
                />
              ))}
            </motion.div>

            <motion.div
              className="page-loader-ring page-loader-ring-secondary"
              animate={{ rotate: -360 }}
              transition={{ duration: 5.6, ease: 'linear', repeat: Infinity }}
            >
              {orbitAngles.map((angle, index) => (
                <motion.span
                  key={`secondary-${angle}`}
                  className="page-loader-dot page-loader-dot-secondary"
                  style={{ backgroundColor: accentColor, transform: `rotate(${angle + 30}deg) translateY(-38px)` }}
                  animate={{ scale: [0.7, 1.1, 0.7], opacity: [0.35, 0.85, 0.35] }}
                  transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity, delay: index * 0.1 }}
                />
              ))}
            </motion.div>

            <motion.div
              className="page-loader-core"
              style={{ backgroundColor: dotColor }}
              animate={{ scale: [1, 0.84, 1], opacity: [1, 0.82, 1] }}
              transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}