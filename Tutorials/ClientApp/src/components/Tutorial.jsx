import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import TutorialDataService from "../services/TutorialService";
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { InputNumber } from 'primereact/inputnumber';
import { Chips } from 'primereact/chips';
import { mapDifficulty } from "../services/Util";
import ActionButtons from "./common/ActionButtons";

const Tutorial = () => {
  const toast = useRef(null);
  const { id } = useParams();
  let navigate = useNavigate();

  const initialTutorialState = {
    id: null,
    title: "",
    category: "",
    description: "",
    published: false,
    author: "",
    readTime: 0,
    difficulty: "beginner",
    tags: "",
    imageUrl: "",
    viewCount: 0,
    likes: 0
  };
  
  const [tutorial, setTutorial] = useState(initialTutorialState);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tagArray, setTagArray] = useState([]);
  
  const difficultyOptions = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' }
  ];

  useEffect(() => {
    // Set New Relic page view name
    if (window.newrelic) {
      window.newrelic.setPageViewName('edit-tutorial');
      window.newrelic.addPageAction('page_loaded', {
        component: 'Tutorial',
        tutorial_id: id,
        timestamp: new Date().toISOString()
      });
    }
    
    if (id) {
      loadTutorial();
    } else {
      setLoading(false);
    }
    
    const startTime = performance.now();
    return () => {
      // Clean up or send final metrics when component unmounts
      if (window.newrelic) {
        const endTime = performance.now();
        window.newrelic.addPageAction('page_exited', {
          component: 'Tutorial',
          tutorial_id: id,
          duration_seconds: (endTime - startTime) / 1000,
          was_modified: dirty
        });
      }
    };
  }, [id]);

  const loadTutorial = async () => {
    setLoading(true);
    
    // Start a New Relic custom trace segment
    /*let actionTrace;
    if (window.newrelic) {
      actionTrace = window.newrelic.interaction();
      actionTrace.setName('load-tutorial-for-edit');
      actionTrace.setAttribute('tutorial_id', id);
    }
    
    const startTime = performance.now(); */
    
    try {
      // Get categories first
      const categoriesData = await TutorialDataService.getCategories();
      setCategories(categoriesData);
      
      // Then get tutorial details
      const response = await TutorialDataService.get(id);
      const tutorialData = response.data;
      
      // Apply difficulty mapping
      const mappedTutorial = mapDifficulty(tutorialData);
      
      // Convert tags string to array if exists
      const tagsArray = mappedTutorial.tags ? mappedTutorial.tags.split(',') : [];
      setTagArray(tagsArray);
      
      setTutorial(mappedTutorial);
      setSelectedCategory(categoriesData.find(c => c.id == mappedTutorial.category) || null);
      setLoading(false);
      
     /* const endTime = performance.now();
      
      if (window.newrelic) {
        window.newrelic.addToTrace({
          name: 'tutorial_loaded_for_edit',
          start: startTime,
          end: endTime,
          type: 'data_fetch'
        });
        window.newrelic.setCustomAttribute('api_metric', 'api.tutorial.get.duration');
        window.newrelic.setCustomAttribute('status_code', 200);
        window.newrelic.setCustomAttribute('tutorial_id', id);
        window.newrelic.setCustomAttribute('tutorial_title', mappedTutorial.title);
        window.newrelic.setCustomAttribute('category', mappedTutorial.category);
        window.newrelic.setCustomAttribute('is_published', mappedTutorial.published);
        
        window.newrelic.setCustomAttribute('current_tutorial_id', id);
        window.newrelic.setCustomAttribute('current_tutorial_title', mappedTutorial.title);
        window.newrelic.setCustomAttribute('current_tutorial_published', mappedTutorial.published);
        
        // Complete the interaction
        if (actionTrace) {
          actionTrace.setAttribute('duration_ms', endTime - startTime);
          actionTrace.setAttribute('success', true);
          actionTrace.save();
        }
      } */
    } catch (error) {
      /*const endTime = performance.now();
      
      if (window.newrelic) {
        window.newrelic.addToTrace({
          name: 'tutorial_load_failed',
          type: 'data_fetch',
          start: startTime,
          end: endTime,
          metric: 'api.tutorial.get.failed',
          statusCode: error.response?.status || 500,
          tutorial_id: id,
          error_message: error.message
        });
        
        window.newrelic.noticeError(error, {
          component: 'Tutorial',
          action: 'loadTutorial',
          tutorial_id: id
        });
        
        // Complete the interaction
        if (actionTrace) {
          actionTrace.setAttribute('error', error.message);
          actionTrace.setAttribute('duration_ms', endTime - startTime);
          actionTrace.save();
        }
      } */
      
      console.error("Error loading tutorial:", error);
      navigate(`/404/${id}`);
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTutorial({ ...tutorial, [name]: value });
    setDirty(true);
    
    // Track significant field changes
    if (name === 'title' || name === 'description') {
      /* if (window.newrelic && value.length > 0) {
        window.newrelic.addPageAction('field_updated', {
          field_name: name,
          character_count: value.length,
          tutorial_id: tutorial.id,
          timestamp: new Date().toISOString()
        });
      } */
    }
  };

  const handleNumberChange = (name, value) => {
    setTutorial({ ...tutorial, [name]: value });
    setDirty(true);
    
    /*if (window.newrelic) {
      window.newrelic.addPageAction('field_updated', {
        field_name: name,
        value: value,
        tutorial_id: tutorial.id,
        timestamp: new Date().toISOString()
      });
    } */
  };

  const onCategoryChange = (event) => {
    setSelectedCategory(event.value);
    setTutorial({...tutorial, 'category': event.value.id});
    setDirty(true);
    
    /*if (window.newrelic) {
      window.newrelic.addPageAction('category_updated', {
        category_id: event.value.id,
        category_name: event.value.category,
        tutorial_id: tutorial.id,
        timestamp: new Date().toISOString()
      });
    } */
  };
  
  const onDifficultyChange = (event) => {
    setTutorial({...tutorial, 'difficulty': event.value});
    setDirty(true);
    
    /*if (window.newrelic) {
      window.newrelic.addPageAction('difficulty_updated', {
        difficulty: event.value,
        tutorial_id: tutorial.id,
        timestamp: new Date().toISOString()
      });
    } */
  };
  
  const onTagsChange = (tags) => {
    setTagArray(tags);
    setTutorial({...tutorial, 'tags': tags.join(',')});
    setDirty(true);

    /*if (window.newrelic) {
      window.newrelic.addPageAction('tags_updated', {
        tags_count: tags.length,
        tags: tags.join(','),
        tutorial_id: tutorial.id,
        timestamp: new Date().toISOString()
      });
    } */
  };

  const togglePublished = () => {
    /*if (window.newrelic) {
      window.newrelic.addPageAction('toggle_published_clicked', {
        tutorial_id: tutorial.id,
        tutorial_title: tutorial.title,
        current_status: tutorial.published,
        new_status: !tutorial.published,
        timestamp: new Date().toISOString()
      });
    } */    
    
    updatePublishedStatus(!tutorial.published);
  };

  const updatePublishedStatus = (newStatus) => {
    setProcessing(true);
    
    // Start a New Relic custom trace segment
    /*let actionTrace;
    if (window.newrelic) {
      actionTrace = window.newrelic.interaction();
      actionTrace.setName('update-tutorial-status');
      actionTrace.setAttribute('tutorial_id', tutorial.id);
      actionTrace.setAttribute('new_status', newStatus ? 'published' : 'unpublished');
    } */
    
    const updatedTutorial = {
      ...tutorial,
      published: newStatus
    };
    
    // const startTime = performance.now();
    
    TutorialDataService.update(tutorial.id, updatedTutorial)
      .then(() => {
        /* const endTime = performance.now();
        
        if (window.newrelic) {
          window.newrelic.addToTrace({
            name: 'tutorial_status_update',
            start: startTime,
            end: endTime,
            type: 'tutorial'
          });
          window.newrelic.setCustomAttribute('api_metric', 'api.tutorial.update.duration');
          window.newrelic.setCustomAttribute('status_code', 200);
          window.newrelic.setCustomAttribute('tutorial_id', tutorial.id);
          
          window.newrelic.addPageAction('tutorial_status_updated', {
            tutorial_id: tutorial.id,
            tutorial_title: tutorial.title,
            new_status: newStatus ? 'published' : 'unpublished',
            processing_time_ms: endTime - startTime,
            timestamp: new Date().toISOString()
          });
          
          // Complete the interaction
          if (actionTrace) {
            actionTrace.setAttribute('duration_ms', endTime - startTime);
            actionTrace.setAttribute('success', true);
            actionTrace.save();
          }
        } */
        
        setTutorial({ ...tutorial, published: newStatus });
        
        toast.current.show({
          severity: 'success',
          summary: 'Status Updated',
          detail: newStatus ? 'Tutorial published successfully' : 'Tutorial unpublished',
          life: 3000
        });
        
        setProcessing(false);
      })
      .catch(error => {
        /* const endTime = performance.now();
        
        if (window.newrelic) {
          window.newrelic.addToTrace({
            name: 'tutorial_status_update_failed',
            start: startTime,
            end: endTime,
            type: 'tutorial'
          });
          window.newrelic.setCustomAttribute('api_metric', 'api.tutorial.update.failed');
          window.newrelic.setCustomAttribute('status_code', error.response?.status || 500);
          window.newrelic.setCustomAttribute('tutorial_id', tutorial.id);
          window.newrelic.setCustomAttribute('error_message', error.message);
          
          window.newrelic.noticeError(error, {
            action: 'update_published_status',
            tutorial_id: tutorial.id,
            tutorial_title: tutorial.title
          });
          
          // Complete the interaction
          if (actionTrace) {
            actionTrace.setAttribute('error', error.message);
            actionTrace.setAttribute('duration_ms', endTime - startTime);
            actionTrace.setAttribute('success', false);
            actionTrace.save();
          }
        } */
        
        console.error("Error updating status:", error);
        
        toast.current.show({
          severity: 'error',
          summary: 'Update Failed',
          detail: 'Failed to update tutorial status',
          life: 3000
        });
        
        setProcessing(false);
      });
  };

  const saveTutorial = () => {
    if (!tutorial.title) {
      toast.current.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Title is required',
        life: 3000
      });
      
      /*if (window.newrelic) {
        window.newrelic.addPageAction('validation_error', {
          field: 'title',
          error: 'required',
          tutorial_id: tutorial.id,
          timestamp: new Date().toISOString()
        });
      } */
      
      return;
    }
    
    setProcessing(true);
    
    // Start a New Relic custom trace segment
    /*let actionTrace;
    if (window.newrelic) {
      actionTrace = window.newrelic.interaction();
      actionTrace.setName('save-tutorial-changes');
      actionTrace.setAttribute('tutorial_id', tutorial.id);
      
      window.newrelic.addPageAction('tutorial_save_started', {
        tutorial_id: tutorial.id,
        tutorial_title: tutorial.title,
        timestamp: new Date().toISOString()
      });
    } 
    
    const startTime = performance.now(); */
    
    TutorialDataService.update(tutorial.id, tutorial)
      .then(() => {
        /*const endTime = performance.now();
        
        if (window.newrelic) {
          window.newrelic.addToTrace({
            name: 'tutorial_updated',
            start: startTime,
            end: endTime,
            type: 'tutorial'
          });
          window.newrelic.setCustomAttribute('api_metric', 'api.tutorial.update.duration');
          window.newrelic.setCustomAttribute('status_code', 200);
          window.newrelic.setCustomAttribute('tutorial_id', tutorial.id);
          
          window.newrelic.addPageAction('tutorial_updated', {
            tutorial_id: tutorial.id,
            tutorial_title: tutorial.title,
            processing_time_ms: endTime - startTime,
            timestamp: new Date().toISOString()
          });
          
          // Complete the interaction
          if (actionTrace) {
            actionTrace.setAttribute('duration_ms', endTime - startTime);
            actionTrace.setAttribute('success', true);
            actionTrace.save();
          }
        } */
        
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Tutorial updated successfully',
          life: 3000
        });
        
        setDirty(false);
        setProcessing(false);
      })
      .catch(error => {
        /*const endTime = performance.now();
        
        if (window.newrelic) {
          window.newrelic.addToTrace({
            name: 'tutorial_update_failed',
            type: 'tutorial',
            start: startTime,
            end: endTime,
            metric: 'api.tutorial.update.failed',
            statusCode: error.response?.status || 500,
            tutorial_id: tutorial.id,
            error_message: error.message
          });
          
          window.newrelic.noticeError(error, {
            action: 'update_tutorial',
            tutorial_id: tutorial.id,
            tutorial_title: tutorial.title
          });
          
          // Complete the interaction
          if (actionTrace) {
            actionTrace.setAttribute('error', error.message);
            actionTrace.setAttribute('duration_ms', endTime - startTime);
            actionTrace.setAttribute('success', false);
            actionTrace.save();
          }
        } */
        
        console.error("Error updating tutorial:", error);
        
        toast.current.show({
          severity: 'error',
          summary: 'Update Failed',
          detail: 'Failed to update tutorial: ' + error.message,
          life: 3000
        });
        
        setProcessing(false);
      });
  };

  const confirmDeleteTutorial = () => {
    /*if (window.newrelic) {
      window.newrelic.addPageAction('delete_tutorial_dialog_opened', {
        tutorial_id: tutorial.id,
        tutorial_title: tutorial.title,
        timestamp: new Date().toISOString()
      });
    } */
    
    confirmDialog({
      message: 'Are you sure you want to delete this tutorial?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: deleteTutorial
    });
  };

  const deleteTutorial = () => {
    setProcessing(true);
    
    // Start a New Relic custom trace segment
    /*let actionTrace;
    if (window.newrelic) {
      actionTrace = window.newrelic.interaction();
      actionTrace.setName('delete-tutorial');
      actionTrace.setAttribute('tutorial_id', tutorial.id);
      
      window.newrelic.addPageAction('tutorial_delete_started', {
        tutorial_id: tutorial.id,
        tutorial_title: tutorial.title,
        timestamp: new Date().toISOString()
      });
    } 
    
    const startTime = performance.now();*/
    
    TutorialDataService.remove(tutorial.id)
      .then(() => {
        /*const endTime = performance.now();
        
        if (window.newrelic) {
          window.newrelic.addToTrace({
            name: 'tutorial_deleted',
            type: 'tutorial',
            start: startTime,
            end: endTime,
            metric: 'api.tutorial.delete.duration',
            statusCode: 200,
            tutorial_id: tutorial.id
          });
          
          window.newrelic.addPageAction('tutorial_deleted', {
            tutorial_id: tutorial.id,
            tutorial_title: tutorial.title,
            processing_time_ms: endTime - startTime,
            timestamp: new Date().toISOString()
          });
          
          // Complete the interaction
          if (actionTrace) {
            actionTrace.setAttribute('duration_ms', endTime - startTime);
            actionTrace.setAttribute('success', true);
            actionTrace.save();
          }
        } */
        
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Tutorial deleted successfully',
          life: 3000
        });
        
        navigate("/tutorials");
      })
      .catch(error => {
        /*const endTime = performance.now();
        
        if (window.newrelic) {
          window.newrelic.addToTrace({
            name: 'tutorial_delete_failed',
            type: 'tutorial',
            start: startTime,
            end: endTime,
            metric: 'api.tutorial.delete.failed',
            statusCode: error.response?.status || 500,
            tutorial_id: tutorial.id,
            error_message: error.message
          });
          
          window.newrelic.noticeError(error, {
            action: 'delete_tutorial',
            tutorial_id: tutorial.id,
            tutorial_title: tutorial.title
          });
          
          // Complete the interaction
          if (actionTrace) {
            actionTrace.setAttribute('error', error.message);
            actionTrace.setAttribute('duration_ms', endTime - startTime);
            actionTrace.setAttribute('success', false);
            actionTrace.save();
          }
        } */
        
        console.error("Error deleting tutorial:", error);
        
        toast.current.show({
          severity: 'error',
          summary: 'Delete Failed',
          detail: 'Failed to delete tutorial: ' + error.message,
          life: 3000
        });
        
        setProcessing(false);
      });
  };

  const handleCancel = () => {
    /*if (window.newrelic) {
      window.newrelic.addPageAction('cancel_tutorial_edit', {
        tutorial_id: tutorial.id,
        tutorial_title: tutorial.title,
        was_modified: dirty,
        timestamp: new Date().toISOString()
      });
    } */
    
    navigate("/tutorials");
  };

  if (loading) {
    return (
      <div className="p-5 text-center">
        <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
        <p className="mt-3">Loading tutorial...</p>
      </div>
    );
  }

  const getStatusTag = () => {
    return tutorial.published ? (
      <Tag value="Published" severity="success" />
    ) : (
      <Tag value="Draft" severity="warning" />
    );
  };
  
  const getDifficultyTag = () => {
    const severityMap = {
      beginner: 'info',
      intermediate: 'warning',
      advanced: 'danger'
    };
    
    return (
      <Tag 
        value={tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1)} 
        severity={severityMap[tutorial.difficulty] || 'info'} 
      />
    );
  };

  const lastUpdated = new Date(tutorial.updatedAt).toLocaleString();

  return (
    <div className="tutorial-editor p-3">
      <Toast ref={toast} position="bottom-right" />
      <ConfirmDialog />
      
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h2 className="mb-1">Edit Tutorial</h2>
          <div className="d-flex align-items-center">
            {getStatusTag()}
            <small className="text-muted ml-3">
              Last updated: {lastUpdated}
            </small>
          </div>
        </div>
        
        <div className="mt-3 mt-md-0">
          <ActionButtons
            onCancel={handleCancel}
            onSave={saveTutorial}
            onDelete={confirmDeleteTutorial}
            onPublish={togglePublished}
            onUnpublish={togglePublished}
            saveDisabled={!dirty || processing}
            showDelete={true}
            showPublish={true}
            isPublished={tutorial.published}
            processing={processing}
            saveLabel="Save Changes"
            cancelLabel="Back to List"
          />
        </div>
      </div>
      
      <Card className="shadow-sm mb-4">
        <div className="row">
          <div className="col-md-8">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <InputText
                id="title"
                name="title"
                value={tutorial.title}
                onChange={handleInputChange}
                className="w-100"
                placeholder="E.g., Getting Started with React Hooks for Beginners"
                required
              />
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <Dropdown
                    id="category"
                    value={selectedCategory}
                    options={categories}
                    onChange={onCategoryChange}
                    optionLabel="category"
                    placeholder="Select a category"
                    className="w-100"
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="author" className="form-label">Author</label>
                  <InputText
                    id="author"
                    name="author"
                    value={tutorial.author || ''}
                    onChange={handleInputChange}
                    className="w-100"
                    placeholder="E.g., John Smith"
                  />
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="difficulty" className="form-label">Difficulty Level</label>
                  <Dropdown
                    id="difficulty"
                    value={tutorial.difficulty}
                    options={difficultyOptions}
                    onChange={onDifficultyChange}
                    placeholder="Select difficulty"
                    className="w-100"
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="readTime" className="form-label">Read Time (minutes)</label>
                  <InputNumber
                    id="readTime"
                    value={tutorial.readTime}
                    onValueChange={(e) => handleNumberChange('readTime', e.value)}
                    min={1}
                    className="w-100"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="imageUrl" className="form-label">Image URL</label>
              <InputText
                id="imageUrl"
                name="imageUrl"
                value={tutorial.imageUrl || ''}
                onChange={handleInputChange}
                className="w-100"
                placeholder="E.g., https://example.com/images/tutorial-banner.jpg"
              />
              {tutorial.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={tutorial.imageUrl} 
                    alt="Tutorial preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }} 
                    className="rounded"
                  />
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor="tags" className="form-label">Tags</label>
              <Chips
                id="tags"
                value={tagArray}
                onChange={(e) => onTagsChange(e.value)}
                separator=","
                className="w-100"
                placeholder="Add tags like 'javascript', 'react', 'frontend' and press Enter"
              />
              <small className="text-muted">Press Enter after each tag</small>
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <InputTextarea
                id="description"
                name="description"
                value={tutorial.description}
                onChange={handleInputChange}
                rows={6}
                className="w-100"
                autoResize
                placeholder="Provide a detailed description of your tutorial. Include what readers will learn, prerequisites, and why this tutorial is valuable."
              />
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 bg-light">
              <div className="card-body">
                <h5 className="card-title">Tutorial Details</h5>
                <Divider />
                
                <p className="mb-2">
                  <strong>ID:</strong><br />
                  <small className="text-muted">{tutorial.id}</small>
                </p>
                
                <p className="mb-2">
                  <strong>Status:</strong><br />
                  {tutorial.published ? (
                    <Chip label="Published" className="custom-chip published" />
                  ) : (
                    <Chip label="Draft" className="custom-chip pending" />
                  )}
                </p>
                
                <p className="mb-2">
                  <strong>Difficulty:</strong><br />
                  {getDifficultyTag()}
                </p>
                
                <p className="mb-2">
                  <strong>Views:</strong><br />
                  <span className="d-flex align-items-center">
                    <i className="pi pi-eye mr-2"></i>
                    {tutorial.viewCount || 0}
                  </span>
                </p>
                
                <p className="mb-2">
                  <strong>Likes:</strong><br />
                  <span className="d-flex align-items-center">
                    <i className="pi pi-thumbs-up mr-2"></i>
                    {tutorial.likes || 0}
                  </span>
                </p>
                
                <p className="mb-2">
                  <strong>Created:</strong><br />
                  <small className="text-muted">{new Date(tutorial.createdAt).toLocaleString()}</small>
                </p>
                
                <p className="mb-0">
                  <strong>Last Updated:</strong><br />
                  <small className="text-muted">{lastUpdated}</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Tutorial;
