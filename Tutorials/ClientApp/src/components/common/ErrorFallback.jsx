import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="error-card shadow-sm" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <i className="pi pi-exclamation-triangle text-danger" style={{ fontSize: '3rem' }}></i>
          <h2 className="mt-3 mb-2">Something went wrong</h2>
          <p className="text-muted">We&apos;re sorry, but an error has occurred.</p>
        </div>
        
        <div className="bg-light p-3 mb-3 rounded">
          <p className="font-monospace text-danger mb-0">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>
        
        <div className="d-flex justify-content-between">
          <Button 
            label="Try Again" 
            icon="pi pi-refresh"
            className="p-button-primary" 
            onClick={resetErrorBoundary} 
          />
          
          <Button 
            label="Go Home" 
            icon="pi pi-home"
            className="p-button-secondary" 
            onClick={() => window.location.href = '/'}
          />
        </div>
      </Card>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired
};

export default ErrorFallback; 