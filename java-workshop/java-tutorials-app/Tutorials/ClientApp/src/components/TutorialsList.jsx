import { useState, useEffect, useRef } from "react";
import TutorialDataService from "../services/TutorialService";
import { Link, useNavigate } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ToggleButton } from 'primereact/togglebutton';
import { Tag } from 'primereact/tag';
import { mapCategories, mapDifficulty } from "../services/Util";

const TutorialsList = () => {
  // window.newrelic.setPageViewName('Tutorials');

  const [tutorials, setTutorials] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [categories, setCategories] = useState([]);
  const [publishedFilter, setPublishedFilter] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState(null);
  const [sortField, setSortField] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState(-1);
  
  const toast = useRef(null);
  const dt = useRef(null);
  const navigate = useNavigate();

  const difficultyOptions = [
    { label: 'All Levels', value: null },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get categories first
      const categoriesData = await TutorialDataService.getCategories();
      setCategories(categoriesData);
      
      // Now get tutorials
      const response = await TutorialDataService.getAll();
      const categoriesMapped = await mapCategories(response.data);
      const fullMappedData = mapDifficulty(categoriesMapped);
      setTutorials(fullMappedData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading tutorials:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load tutorials',
        life: 3000
      });
      setLoading(false);
    }
  };

  const onSearch = () => {
    if (!searchTitle.trim()) {
      loadData();
      return;
    }
    
    TutorialDataService.findByTitle(searchTitle)
      .then(async response => {
        const categoriesMapped = await mapCategories(response.data);
        const fullMappedData = mapDifficulty(categoriesMapped);
        setTutorials(fullMappedData);
      })
      .catch(error => {
        console.error("Error searching tutorials:", error);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to search tutorials',
          life: 3000
        });
      });
  };

  const handleTitleSearch = (e) => {
    const value = e.target.value;
    setSearchTitle(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const removeAllTutorials = () => {
    if (window.confirm('Are you sure you want to delete all tutorials? This action cannot be undone.')) {
      TutorialDataService.removeAll()
        .then(() => {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'All tutorials deleted successfully',
            life: 3000
          });
          loadData();
        })
        .catch(error => {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete tutorials: ' + error.message,
            life: 3000
          });
        });
    }
  };

  const confirmDelete = (tutorial) => {
    if (window.confirm(`Are you sure you want to delete "${tutorial.title}"?`)) {
      TutorialDataService.remove(tutorial.id)
        .then(() => {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Tutorial deleted successfully',
            life: 3000
          });
          loadData();
        })
        .catch(error => {
          toast.current.show({
            severity: 'error',
            summary: error?.message || 'Generic error message',
            detail: 'Failed to delete tutorial',
            life: 3000
          });
        });
    }
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const viewTutorial = (tutorial) => {
    navigate(`/tutorials/${tutorial.id}`);
  };

  const onSort = (event) => {
    setSortField(event.sortField);
    setSortOrder(event.sortOrder);
  };

  const applyFilters = () => {
    let filteredData = [...tutorials];
    
    // Filter by category
    if (categoryFilter) {
      filteredData = filteredData.filter(t => 
        t.category && t.category.toLowerCase() === categoryFilter.category.toLowerCase()
      );
    }
    
    // Filter by published status
    if (publishedFilter !== null) {
      filteredData = filteredData.filter(t => t.published === publishedFilter);
    }
    
    // Filter by difficulty
    if (difficultyFilter) {
      filteredData = filteredData.filter(t => t.difficulty === difficultyFilter);
    }
    
    return filteredData;
  };

  // Templates for DataTable
  const publishedTemplate = (rowData) => {
    return rowData.published ? 
      <Tag severity="success" value="Published" /> : 
      <Tag severity="warning" value="Draft" />;
  };

  const categoryTemplate = (rowData) => {
    return rowData.category ? 
      <Chip label={rowData.category} className="p-2" /> : 
      <span className="text-muted">None</span>;
  };

  const difficultyTemplate = (rowData) => {
    const severityMap = {
      beginner: 'info',
      intermediate: 'warning',
      advanced: 'danger'
    };
    
    if (!rowData.difficulty) return <span className="text-muted">Not set</span>;
    
    const label = rowData.difficulty.charAt(0).toUpperCase() + rowData.difficulty.slice(1);
    return <Tag severity={severityMap[rowData.difficulty]} value={label} />;
  };

  const dateTemplate = (rowData) => {
    return new Date(rowData.updatedAt).toLocaleDateString();
  };
  
  const readTimeTemplate = (rowData) => {
    return rowData.readTime ? `${rowData.readTime} min` : 'N/A';
  };

  const actionsTemplate = (rowData) => {
    return (
      <div className="d-flex">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-text p-button-info"
          onClick={() => viewTutorial(rowData)}
          tooltip="View/Edit"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-danger"
          onClick={() => confirmDelete(rowData)}
          tooltip="Delete"
        />
      </div>
    );
  };

  const header = (
    <div className="d-flex flex-wrap justify-content-between align-items-center">
      <div className="d-flex align-items-center mb-2 mb-md-0">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search in table..."
            className="p-inputtext-sm"
          />
        </span>
      </div>
      
      <div className="d-flex flex-wrap">
        <Button 
          icon="pi pi-upload" 
          label="Export" 
          className="p-button-outlined p-button-sm mr-2 mb-2 mb-md-0"
          onClick={exportCSV} 
        />
        <div className="d-flex align-items-center ml-2">
          <span className="mr-2">View:</span>
          <div className="p-buttonset">
            <Button 
              icon="pi pi-list" 
              className={`p-button-sm ${viewMode === 'table' ? 'p-button-primary' : 'p-button-outlined'}`}
              onClick={() => setViewMode('table')}
              tooltip="Table View"
            />
            <Button 
              icon="pi pi-th-large" 
              className={`p-button-sm ${viewMode === 'cards' ? 'p-button-primary' : 'p-button-outlined'}`}
              onClick={() => setViewMode('cards')}
              tooltip="Card View"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCardView = () => {
    const filteredTutorials = applyFilters();
    
    return (
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filteredTutorials.length > 0 ? (
          filteredTutorials.map((tutorial) => (
            <Card key={tutorial.id} className="shadow-sm h-100">
              <div className="d-flex justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  {publishedTemplate(tutorial)}
                </div>
                {tutorial.difficulty && (
                  <div>{difficultyTemplate(tutorial)}</div>
                )}
              </div>
              
              <h5 className="mb-2 text-truncate" title={tutorial.title}>
                {tutorial.title}
              </h5>
              
              {tutorial.imageUrl && (
                <img 
                  src={tutorial.imageUrl} 
                  alt={tutorial.title}
                  className="mb-3 w-100"
                  style={{ height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                />
              )}
              
              <div className="d-flex justify-content-between mb-2">
                {tutorial.category && (
                  <div>{categoryTemplate(tutorial)}</div>
                )}
                {tutorial.readTime && (
                  <div><small><i className="pi pi-clock mr-1"></i>{tutorial.readTime} min read</small></div>
                )}
              </div>
              
              <p className="mb-3" style={{ 
                height: '60px', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical' 
              }}>
                {tutorial.description}
              </p>
              
              <div className="mt-auto">
                <small className="text-muted d-block mb-2">
                  Last updated: {dateTemplate(tutorial)}
                </small>
                
                <div className="d-flex justify-content-between mt-3">
                  <Button
                    label="Edit"
                    icon="pi pi-pencil"
                    className="p-button-sm"
                    onClick={() => viewTutorial(tutorial)}
                  />
                  <Button
                    icon="pi pi-trash"
                    className="p-button-danger p-button-sm p-button-outlined"
                    onClick={() => confirmDelete(tutorial)}
                  />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center col-12 p-5">
            <i className="pi pi-search" style={{ fontSize: '2rem', color: '#ccc' }}></i>
            <p className="mt-3">No tutorials found matching your criteria.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} position="bottom-right" />
      
      <div className="d-flex flex-column flex-md-row justify-content-between mb-4">
        <h2>Tutorials</h2>
        <div>
          <Link to="/add">
            <Button 
              label="Add New" 
              icon="pi pi-plus" 
              className="p-button-success mb-2 mb-md-0"
            />
          </Link>
          <Button 
            label="Delete All" 
            icon="pi pi-trash" 
            className="p-button-danger p-button-outlined ml-2"
            onClick={removeAllTutorials}
          />
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Search by Title</label>
              <div className="p-inputgroup">
                <InputText
                  value={searchTitle}
                  onChange={handleTitleSearch}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter tutorial title"
                  className="w-100"
                />
                <Button icon="pi pi-search" className="p-button-primary" onClick={onSearch} />
              </div>
            </div>
            
            <div className="col-md-2">
              <label className="form-label">Category</label>
              <Dropdown
                value={categoryFilter}
                options={categories}
                onChange={(e) => setCategoryFilter(e.value)}
                optionLabel="category"
                placeholder="Select Category"
                className="w-100"
                showClear
              />
            </div>
            
            <div className="col-md-2">
              <label className="form-label">Difficulty</label>
              <Dropdown
                value={difficultyFilter}
                options={difficultyOptions}
                onChange={(e) => setDifficultyFilter(e.value)}
                placeholder="Select Level"
                className="w-100"
              />
            </div>
            
            <div className="col-md-3">
              <label className="form-label">Publication Status</label>
              <div className="d-flex">
                <ToggleButton
                  offLabel="All"
                  onLabel="Published"
                  offIcon="pi pi-filter"
                  onIcon="pi pi-check-circle"
                  checked={publishedFilter === true}
                  onChange={(e) => setPublishedFilter(e.value ? true : null)}
                  className="mr-2 w-100"
                />
                <ToggleButton
                  offLabel="All"
                  onLabel="Drafts"
                  offIcon="pi pi-filter"
                  onIcon="pi pi-pencil"
                  checked={publishedFilter === false}
                  onChange={(e) => setPublishedFilter(e.value ? false : null)}
                  className="w-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {viewMode === 'table' ? (
        <div className="card">
          <DataTable
            ref={dt}
            value={applyFilters()}
            selection={selectedTutorial}
            onSelectionChange={(e) => setSelectedTutorial(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tutorials"
            globalFilter={globalFilter}
            header={header}
            responsiveLayout="scroll"
            emptyMessage="No tutorials found"
            className="p-datatable-sm"
            loading={loading}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={onSort}
            removableSort
          >
            <Column field="title" header="Title" sortable style={{ minWidth: '16rem' }} />
            <Column header="Category" body={categoryTemplate} sortable field="category" style={{ minWidth: '8rem' }} />
            <Column header="Difficulty" body={difficultyTemplate} sortable field="difficulty" style={{ minWidth: '8rem' }} />
            <Column header="Read Time" body={readTimeTemplate} sortable field="readTime" style={{ minWidth: '6rem' }} />
            <Column header="Status" body={publishedTemplate} sortable field="published" style={{ minWidth: '8rem' }} />
            <Column header="Last Updated" body={dateTemplate} field="updatedAt" style={{ minWidth: '10rem' }} sortable defaultSortOrder={-1} />
            <Column body={actionsTemplate} exportable={false} style={{ minWidth: '8rem' }} />
          </DataTable>
        </div>
      ) : (
        renderCardView()
      )}
    </div>
  );
};

export default TutorialsList;
