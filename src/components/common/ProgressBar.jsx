/**
 * Accessible progress bar. Colours shift to warning/over as usage climbs.
 * @param {{ percent: number }} props value 0–100+ (clamped visually at 100)
 */
export function ProgressBar({ percent }) {
  const clamped = Math.min(100, Math.max(0, percent));
  let modifier = '';
  if (percent >= 100) modifier = 'progress__bar--over';
  else if (percent >= 80) modifier = 'progress__bar--warn';

  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`progress__bar ${modifier}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
