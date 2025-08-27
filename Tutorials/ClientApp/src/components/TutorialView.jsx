import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import TutorialDataService from "../services/TutorialService";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { mapDifficulty, mapCategories } from "../services/Util";
import ActionButtons from "./common/ActionButtons";

const TutorialView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);
  
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedTutorials, setRelatedTutorials] = useState([]);

  useEffect(() => {
    loadTutorial();
  }, [id]);

  const loadTutorial = async () => {
    setLoading(true);
    try {
      // Load the tutorial
      const response = await TutorialDataService.get(id);
      
      // Apply difficulty and category mapping
      const tutorialData = mapDifficulty(response.data);
      
      // Now get categories to map the tutorial's category
      const categories = await TutorialDataService.getCategories();
      if (tutorialData.category) {
        const categoryId = tutorialData.category;
        const matchedCategory = categories.find(c => c.id == categoryId);
        if (matchedCategory) {
          tutorialData.category = matchedCategory.category;
          
          // Load related tutorials with the same category
          loadRelatedTutorials(matchedCategory.category, tutorialData.id);
        }
      }
      
      setTutorial(tutorialData);
      
      // Record view
      try {
        await TutorialDataService.incrementViewCount(id);
      } catch (viewErr) {
        console.error("Failed to record view:", viewErr);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading tutorial:", error);
      navigate('/404');
      setLoading(false);
    }
  };

  const loadRelatedTutorials = async (category, currentId) => {
    try {
      const response = await TutorialDataService.getAll();
      const allTutorials = response.data;
      
      // Map categories first
      const mappedData = await mapCategories(allTutorials);
      
      // Then apply difficulty mapping
      const fullMappedData = mapDifficulty(mappedData);
      
      // Filter for published tutorials in the same category, excluding current tutorial
      const related = fullMappedData
        .filter(t => t.published && t.category === category && t.id !== currentId)
        .slice(0, 3); // Limit to 3 related tutorials
      
      setRelatedTutorials(related);
    } catch (error) {
      console.error("Error loading related tutorials:", error);
    }
  };

  const handleLike = async () => {
    try {
      await TutorialDataService.incrementLikes(id);
      setTutorial(prev => ({ ...prev, likes: prev.likes + 1 }));
      
      toast.current.show({
        severity: 'success',
        summary: 'Thanks!',
        detail: 'You liked this tutorial',
        life: 3000
      });
    } catch (error) {
      console.error("Error liking tutorial:", error);
      
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to like tutorial',
        life: 3000
      });
    }
  };

  const getDifficultyTag = () => {
    if (!tutorial || !tutorial.difficulty) return null;
    
    const severityMap = {
      beginner: 'info',
      intermediate: 'warning',
      advanced: 'danger'
    };
    
    const label = tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1);
    return <Tag severity={severityMap[tutorial.difficulty]} value={label} />;
  };

  const renderTagChips = () => {
    if (!tutorial || !tutorial.tags) return null;
    
    return tutorial.tags.split(',').map(tag => (
      <Chip key={tag} label={tag.trim()} className="mr-2 mb-2" />
    ));
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancel = () => {
    navigate('/tutorials');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.current.show({
      severity: 'info',
      summary: 'Link Copied',
      detail: 'Tutorial link copied to clipboard',
      life: 3000
    });
  };

  if (loading) {
    return (
      <div className="p-5 text-center">
        <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
        <p className="mt-3">Loading tutorial...</p>
      </div>
    );
  }

  if (!tutorial) {
    return null;
  }

  return (
    <div className="tutorial-view p-4">
      <Toast ref={toast} position="bottom-right" />
      
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <h2 className="mb-0">Tutorial</h2>
        <div className="mt-3 mt-md-0">
          <ActionButtons
            onCancel={handleCancel}
            cancelLabel="Back to Tutorials"
            showSave={false}
          />
        </div>
      </div>
      
      <Card className="tutorial-card shadow mb-4">
        {tutorial.imageUrl && (
          <div className="tutorial-image mb-4">
            <img 
              src={tutorial.imageUrl} 
              alt={tutorial.title} 
              className="w-100" 
              style={{ maxHeight: '300px', objectFit: 'cover', borderRadius: '4px' }}
            />
          </div>
        )}
        
        <div className="d-flex flex-wrap align-items-center mb-2">
          {getDifficultyTag()}
          {tutorial.readTime && (
            <span className="ml-3 text-muted">
              <i className="pi pi-clock mr-1"></i> {tutorial.readTime} min read
            </span>
          )}
          <span className="ml-3 text-muted">
            <i className="pi pi-eye mr-1"></i> {tutorial.viewCount} views
          </span>
        </div>
        
        <h1 className="mb-3">{tutorial.title}</h1>
        
        <div className="d-flex flex-wrap align-items-center mb-4">
          <div className="mr-3">
            <small className="text-muted">By {tutorial.author || 'Anonymous'}</small>
          </div>
          <div className="mr-3">
            <small className="text-muted">Published on {formatDate(tutorial.createdAt)}</small>
          </div>
          {tutorial.updatedAt !== tutorial.createdAt && (
            <div>
              <small className="text-muted">Updated on {formatDate(tutorial.updatedAt)}</small>
            </div>
          )}
        </div>
        
        <div className="tutorial-content mb-4">
          {/* Format the description with paragraphs */}
          {tutorial.description.split('\n').map((paragraph, index) => (
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </div>
        
        {tutorial.tags && (
          <div className="mb-4">
            <h4>Tags</h4>
            <div className="d-flex flex-wrap">
              {renderTagChips()}
            </div>
          </div>
        )}
        
        <div className="d-flex justify-content-between mt-4">
          <Button
            icon="pi pi-thumbs-up"
            label={`Like${tutorial.likes > 0 ? ` (${tutorial.likes})` : ''}`}
            className="p-button-outlined p-button-success"
            onClick={handleLike}
          />
          
          <Button
            icon="pi pi-share-alt"
            label="Share"
            className="p-button-outlined"
            onClick={handleShare}
          />
        </div>
      </Card>
      
      {relatedTutorials.length > 0 && (
        <div className="related-tutorials">
          <h3 className="mb-3">Related Tutorials</h3>
          <Divider />
          
          <div className="d-flex flex-wrap">
            {relatedTutorials.map(related => (
              <Card key={related.id} className="related-card mr-3 mb-3" style={{ width: '300px' }}>
                {related.imageUrl && (
                  <img 
                    src={related.imageUrl} 
                    alt={related.title} 
                    className="w-100 mb-2" 
                    style={{ height: '120px', objectFit: 'cover', borderRadius: '4px' }} 
                  />
                )}
                
                <h5 className="mb-2 text-truncate">{related.title}</h5>
                
                <p className="mb-3 text-truncate">
                  {related.description}
                </p>
                
                <Button
                  label="View Tutorial"
                  className="p-button-sm p-button-outlined"
                  onClick={() => navigate(`/view/${related.id}`)}
                />
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialView; 