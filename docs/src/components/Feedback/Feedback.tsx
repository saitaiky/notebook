import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { trackEvent } from '@site/src/utils/analytics';
import styles from './styles.module.scss';

type Rating = 1 | 2 | 3 | 4 | 5;

export const Feedback = ({ metadata }: { metadata: any }) => {
  const { siteConfig } = useDocusaurusContext();
  const [rating, setRating] = useState<Rating | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const scores: Rating[] = [1, 2, 3, 4, 5];
  const analyticsEnabled = siteConfig.customFields?.analyticsProvider === 'gtm';

  const handleSubmit = () => {
    if (rating === null) {
      setErrorText('Please select a score.');
      return;
    }

    const sent = trackEvent('feedback_submit', {
      feedback_rating: rating,
      feedback_helpful: rating >= 4,
    });

    if (!sent) {
      setErrorText('Allow analytics in Analytics settings before sending this anonymous rating.');
      return;
    }

    setErrorText(null);
    setIsSubmitSuccess(true);
  };

  if (!analyticsEnabled || metadata.source === '@site/docs/index.mdx' || metadata.source === '@site/docs/index.md') {
    return null;
  }

  return (
    <div className={styles.feedback} id="feedback">
      <div className={styles.form}>
        <div className={styles.topSection}>
          <h3>Was this page useful?</h3>
          {isSubmitSuccess ? (
            <div className={styles.successMessage}>
              <p>Thanks—your anonymous rating was recorded.</p>
            </div>
          ) : (
            <>
              <p>Only the score and page category are collected.</p>
              <div className={styles.numberRow}>
                {scores.map(score => (
                  <button
                    type="button"
                    className={styles.star}
                    key={score}
                    aria-label={`Rate this page ${score} out of 5`}
                    aria-pressed={rating === score}
                    onClick={() => {
                      setRating(score);
                      setErrorText(null);
                    }}
                    onMouseEnter={() => setHoveredScore(score)}
                    onMouseLeave={() => setHoveredScore(null)}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill={
                          (rating !== null && rating >= score) || (hoveredScore !== null && hoveredScore >= score)
                            ? '#ffc107'
                            : '#B1BCC7'
                        }
                        d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                      />
                    </svg>
                  </button>
                ))}
              </div>
              {errorText ? <p className={styles.errorText}>{errorText}</p> : null}
              <div className={styles.buttonContainer}>
                <button
                  type="button"
                  disabled={rating === null}
                  className={rating === null ? styles.buttonDisabled : ''}
                  onClick={handleSubmit}
                >
                  Send rating
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
