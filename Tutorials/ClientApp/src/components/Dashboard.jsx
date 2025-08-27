import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Link } from 'react-router-dom';
import TutorialDataService from '../services/TutorialService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tutorials, setTutorials] = useState([]);
  const [categoryStats, setCategoryStats] = useState({ labels: [], data: [] });
  const [publishedStats, setPublishedStats] = useState({ published: 0, unpublished: 0 });
  const [recentTutorials, setRecentTutorials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get all tutorials
        const response = await TutorialDataService.getAll();
        const allTutorials = response.data;
        setTutorials(allTutorials);
        
        // Process category data
        const categories = await TutorialDataService.getCategories();
        const categoryMap = new Map();
        
        // Initialize category counts
        categories.forEach(category => {
          categoryMap.set(category.id, { 
            name: category.category, 
            count: 0 
          });
        });
        
        // Count tutorials by category
        allTutorials.forEach(tutorial => {
          if (tutorial.category && categoryMap.has(Number(tutorial.category))) {
            const category = categoryMap.get(Number(tutorial.category));
            category.count += 1;
          }
        });
        
        // Extract data for chart
        const labels = [];
        const data = [];
        categoryMap.forEach(category => {
          labels.push(category.name);
          data.push(category.count);
        });
        
        setCategoryStats({
          labels,
          data
        });
        
        // Get published stats
        const published = allTutorials.filter(t => t.published).length;
        const unpublished = allTutorials.length - published;
        setPublishedStats({ published, unpublished });
        
        // Get recent tutorials (latest 5)
        const sortedTutorials = [...allTutorials].sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        ).slice(0, 5);
        
        setRecentTutorials(sortedTutorials);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const categoryChartData = {
    labels: categoryStats.labels,
    datasets: [
      {
        data: categoryStats.data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ]
      }
    ]
  };

  const publishedChartData = {
    labels: ['Published', 'Unpublished'],
    datasets: [
      {
        data: [publishedStats.published, publishedStats.unpublished],
        backgroundColor: ['#36A2EB', '#FFCE56']
      }
    ]
  };

  const publishedStatusTemplate = (rowData) => {
    return rowData.published ? 
      <Tag severity="success" value="Published" /> : 
      <Tag severity="warning" value="Draft" />;
  };

  const dateTemplate = (rowData) => {
    return new Date(rowData.updatedAt).toLocaleDateString();
  };

  const actionTemplate = (rowData) => {
    return (
      <Link to={`/tutorials/${rowData.id}`}>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" />
      </Link>
    );
  };

  return (
    <div className="dashboard p-4">
      <h2 className="mb-4">Dashboard</h2>
      
      {loading ? (
        <div className="text-center p-5">
          <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Metrics Overview */}
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <Card className="shadow-sm">
              <div className="text-center">
                <div className="text-xl text-primary font-bold">{tutorials.length}</div>
                <div>Total Tutorials</div>
              </div>
            </Card>
            
            <Card className="shadow-sm">
              <div className="text-center">
                <div className="text-xl text-success font-bold">{publishedStats.published}</div>
                <div>Published</div>
              </div>
            </Card>
            
            <Card className="shadow-sm">
              <div className="text-center">
                <div className="text-xl text-warning font-bold">{publishedStats.unpublished}</div>
                <div>Drafts</div>
              </div>
            </Card>
            
            <Card className="shadow-sm">
              <div className="text-center">
                <div className="text-xl text-info font-bold">{categoryStats.labels.length}</div>
                <div>Categories</div>
              </div>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1rem' }}>
            <Card title="Tutorials by Category" className="shadow-sm">
              <Chart type="doughnut" data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Card>
            
            <Card title="Publication Status" className="shadow-sm">
              <Chart type="pie" data={publishedChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Card>
          </div>
          
          {/* Recent Tutorials */}
          <Card title="Recently Updated Tutorials" className="shadow-sm mb-4">
            <DataTable value={recentTutorials} responsiveLayout="scroll" emptyMessage="No tutorials found">
              <Column field="title" header="Title" sortable />
              <Column field="category" header="Category" sortable />
              <Column header="Status" body={publishedStatusTemplate} />
              <Column header="Last Updated" body={dateTemplate} sortable field="updatedAt" />
              <Column header="Actions" body={actionTemplate} />
            </DataTable>
            
            <div className="mt-3 text-right">
              <Link to="/tutorials">
                <Button label="View All Tutorials" className="p-button-text" />
              </Link>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard; 