import { Link } from 'react-router-dom';

/** FinTrack wordmark + logo, optionally linking to a destination. */
export function Brand({ to = '/dashboard' }) {
  const mark = (
    <>
      <img
        className="brand__mark"
        src="/favicon.svg"
        alt=""
        aria-hidden="true"
      />
      <span>FinTrack</span>
    </>
  );
  if (!to) {
    return <span className="brand">{mark}</span>;
  }
  return (
    <Link className="brand" to={to}>
      {mark}
    </Link>
  );
}
