import { Button } from 'primereact/button';
import PropTypes from 'prop-types';

/**
 * Reusable component for action buttons (save, cancel, etc.) with consistent styling
 */
const ActionButtons = ({ 
  onSave, 
  onCancel, 
  onDelete, 
  onPublish, 
  onUnpublish,
  saveLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  deleteLabel = 'Delete',
  publishLabel = 'Publish',
  unpublishLabel = 'Unpublish',
  saveDisabled = false,
  deleteDisabled = false,
  publishDisabled = false,
  showSave = true,
  showCancel = true,
  showDelete = false,
  showPublish = false,
  isPublished = false,
  processing = false
}) => {
  return (
    <div className="d-flex flex-wrap">
      {showCancel && (
        <Button
          icon="pi pi-arrow-left"
          label={cancelLabel}
          className="p-button-outlined p-button-secondary mr-2 mb-2"
          onClick={onCancel}
          disabled={processing}
        />
      )}
      
      {showPublish && !isPublished && (
        <Button
          icon="pi pi-check-circle"
          label={publishLabel}
          className="p-button-success mr-2 mb-2"
          onClick={onPublish}
          disabled={publishDisabled || processing}
        />
      )}
      
      {showPublish && isPublished && (
        <Button
          icon="pi pi-eye-slash"
          label={unpublishLabel}
          className="p-button-warning mr-2 mb-2"
          onClick={onUnpublish}
          disabled={publishDisabled || processing}
        />
      )}
      
      {showDelete && (
        <Button
          icon="pi pi-trash"
          label={deleteLabel}
          className="p-button-danger mr-2 mb-2"
          onClick={onDelete}
          disabled={deleteDisabled || processing}
        />
      )}
      
      {showSave && (
        <Button
          icon="pi pi-save"
          label={saveLabel}
          className="p-button-primary mb-2"
          onClick={onSave}
          disabled={saveDisabled || processing}
        />
      )}
    </div>
  );
};

ActionButtons.propTypes = {
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onPublish: PropTypes.func,
  onUnpublish: PropTypes.func,
  saveLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  deleteLabel: PropTypes.string,
  publishLabel: PropTypes.string,
  unpublishLabel: PropTypes.string,
  saveDisabled: PropTypes.bool,
  deleteDisabled: PropTypes.bool,
  publishDisabled: PropTypes.bool,
  showSave: PropTypes.bool,
  showCancel: PropTypes.bool,
  showDelete: PropTypes.bool,
  showPublish: PropTypes.bool,
  isPublished: PropTypes.bool,
  processing: PropTypes.bool
};

export default ActionButtons; 