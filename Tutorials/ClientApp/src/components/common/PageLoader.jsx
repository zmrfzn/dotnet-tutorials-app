import { ProgressSpinner } from 'primereact/progressspinner';

const PageLoader = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-75">
      <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
      <p className="mt-3 text-muted">Loading...</p>
    </div>
  );
};

export default PageLoader; 