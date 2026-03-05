import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div className="spinner-ring" />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
