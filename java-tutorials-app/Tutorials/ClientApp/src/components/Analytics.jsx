import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressBar } from 'primereact/progressbar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TutorialDataService from '../services/TutorialService';
/* Commenting out analytics instrumentation
import { 
  trackTimeRangeChange, 
  trackCategoryFilter, 
  trackAnalyticsView, 
  trackAnalyticsError,
  trackPageAccess 
} from '../services/newrelic';
*/

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [tutorials, setTutorials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [timeRangeFilter, setTimeRangeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState(null);
  
  // Derived stats
  const [monthlyData, setMonthlyData] = useState({ labels: [], data: [] });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [publishedRatio, setPublishedRatio] = useState({ published: 0, unpublished: 0 });
  const [wordCountStats, setWordCountStats] = useState({ average: 0, max: 0, min: 0 });
  
  /* Commenting out page access tracking
  // Track page access when component mounts
  useEffect(() => {
    trackPageAccess('Analytics', {
      initialTimeRange: timeRangeFilter,
      initialCategory: categoryFilter?.category || 'All Categories'
    });
  }, []); // Empty dependency array means this runs once on mount
  */

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get all tutorials
        const response = await TutorialDataService.getAll();
        const categoriesData = await TutorialDataService.getCategories();
        
        setTutorials(response.data);
        setCategories(categoriesData);
        processData(response.data, categoriesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        /* Commenting out error tracking
        trackAnalyticsError(error, 'dataFetch');
        */
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (tutorials.length > 0 && categories.length > 0) {
      processData(tutorials, categories);
    }
  }, [timeRangeFilter, categoryFilter]);

  const processData = (tutorials, categories) => {
    // Filter tutorials by time range if necessary
    let filteredTutorials = [...tutorials];
    
    if (timeRangeFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      if (timeRangeFilter === '30days') {
        cutoffDate.setDate(now.getDate() - 30);
      } else if (timeRangeFilter === '90days') {
        cutoffDate.setDate(now.getDate() - 90);
      } else if (timeRangeFilter === '1year') {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }
      
      filteredTutorials = tutorials.filter(t => new Date(t.updatedAt) >= cutoffDate);
    }
    
    // Filter by category if selected
    if (categoryFilter) {
      filteredTutorials = filteredTutorials.filter(t => t.category === categoryFilter.id.toString());
    }
    
    // Process monthly data
    const months = {};
    filteredTutorials.forEach(tutorial => {
      const date = new Date(tutorial.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = 0;
      }
      months[monthYear]++;
    });
    
    const sortedMonths = Object.keys(months).sort((a, b) => {
      const [monthA, yearA] = a.split('/').map(Number);
      const [monthB, yearB] = b.split('/').map(Number);
      
      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    });
    
    setMonthlyData({
      labels: sortedMonths,
      data: sortedMonths.map(month => months[month])
    });
    
    // Process category breakdown
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.id.toString(), { 
        name: cat.category, 
        count: 0,
        published: 0,
        unpublished: 0 
      });
    });
    
    filteredTutorials.forEach(tutorial => {
      if (tutorial.category && categoryMap.has(tutorial.category.toString())) {
        const category = categoryMap.get(tutorial.category.toString());
        category.count++;
        
        if (tutorial.published) {
          category.published++;
        } else {
          category.unpublished++;
        }
      }
    });
    
    const categoryStatsArray = [];
    categoryMap.forEach((value, key) => {
      if (value.count > 0) {
        categoryStatsArray.push({
          id: key,
          name: value.name,
          count: value.count,
          published: value.published,
          unpublished: value.unpublished,
          publishedPercentage: value.count > 0 
            ? Math.round((value.published / value.count) * 100) 
            : 0
        });
      }
    });
    
    setCategoryBreakdown(categoryStatsArray.sort((a, b) => b.count - a.count));
    
    // Calculate published ratio
    const published = filteredTutorials.filter(t => t.published).length;
    const unpublished = filteredTutorials.length - published;
    setPublishedRatio({ published, unpublished });
    
    // Calculate word count stats
    if (filteredTutorials.length > 0) {
      const wordCounts = filteredTutorials.map(t => {
        const description = t.description || '';
        return description.split(/\s+/).filter(Boolean).length;
      });
      
      const avg = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
      const max = Math.max(...wordCounts);
      const min = Math.min(...wordCounts);
      
      setWordCountStats({ average: avg, max, min });
    } else {
      setWordCountStats({ average: 0, max: 0, min: 0 });
    }
  };

  const timeRangeOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'Last 90 Days', value: '90days' },
    { label: 'Last Year', value: '1year' }
  ];

  const monthlyChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Tutorials Created',
        data: monthlyData.data,
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.4
      }
    ]
  };

  const publishedChartData = {
    labels: ['Published', 'Unpublished'],
    datasets: [
      {
        data: [publishedRatio.published, publishedRatio.unpublished],
        backgroundColor: ['#36A2EB', '#FFCE56']
      }
    ]
  };

  const publishedPercentageTemplate = (rowData) => {
    return (
      <div>
        <ProgressBar value={rowData.publishedPercentage} style={{ height: '8px' }} />
        <span className="ml-2">{rowData.publishedPercentage}%</span>
      </div>
    );
  };

  const handleTimeRangeChange = (e) => {
    setTimeRangeFilter(e.value);
    /* Commenting out time range tracking
    trackTimeRangeChange(e.value);
    */
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.value);
    /* Commenting out category filter tracking
    trackCategoryFilter(e.value);
    */
  };

  const handleTabChange = () => {
    /* Commenting out view change tracking
    const viewName = e.index === 0 ? 'Timeline Analysis' : 
                    e.index === 1 ? 'Category Analysis' : 
                    e.index === 2 ? 'Content Analysis' : 'Unknown';
    trackAnalyticsView(viewName);
    */
  };

  return (
    <div className="analytics p-4">
      <h2 className="mb-4">Analytics</h2>
      
      {loading ? (
        <div className="text-center p-5">
          <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
          <p className="mt-3">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="filters mb-4 p-3 border rounded bg-light">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="font-bold d-block mb-2">Time Range</label>
                <Dropdown 
                  value={timeRangeFilter} 
                  options={timeRangeOptions} 
                  onChange={handleTimeRangeChange}
                  className="w-100"
                />
              </div>
              
              <div>
                <label className="font-bold d-block mb-2">Category</label>
                <Dropdown 
                  value={categoryFilter} 
                  options={categories} 
                  onChange={handleCategoryChange}
                  optionLabel="category"
                  placeholder="All Categories"
                  className="w-100"
                />
              </div>
            </div>
          </div>
          
          <TabView onTabChange={handleTabChange}>
            <TabPanel header="Timeline Analysis">
              <Card title="Tutorials Created Over Time" className="shadow-sm mb-4">
                <Chart type="line" data={monthlyChartData} />
              </Card>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <Card className="shadow-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold">{tutorials.length}</div>
                    <div>Total Tutorials</div>
                  </div>
                </Card>
                
                <Card className="shadow-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold">{publishedRatio.published}</div>
                    <div>Published</div>
                  </div>
                </Card>
                
                <Card className="shadow-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {tutorials.length > 0 
                        ? Math.round((publishedRatio.published / tutorials.length) * 100) 
                        : 0}%
                    </div>
                    <div>Publication Rate</div>
                  </div>
                </Card>
              </div>
            </TabPanel>
            
            <TabPanel header="Category Analysis">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <Card title="Published vs Unpublished" className="shadow-sm">
                  <Chart type="pie" data={publishedChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </Card>
                
                <Card title="Category Statistics" className="shadow-sm">
                  <DataTable value={categoryBreakdown} responsiveLayout="scroll" paginator rows={5}>
                    <Column field="name" header="Category" sortable />
                    <Column field="count" header="Total" sortable />
                    <Column field="published" header="Published" sortable />
                    <Column header="Published %" body={publishedPercentageTemplate} sortable field="publishedPercentage" />
                  </DataTable>
                </Card>
              </div>
            </TabPanel>
            
            <TabPanel header="Content Analysis">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <Card className="shadow-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold">{wordCountStats.average}</div>
                    <div>Average Word Count</div>
                  </div>
                </Card>
                
                <Card className="shadow-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold">{wordCountStats.max}</div>
                    <div>Longest Description</div>
                  </div>
                </Card>
                
                <Card className="shadow-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold">{wordCountStats.min}</div>
                    <div>Shortest Description</div>
                  </div>
                </Card>
              </div>
            </TabPanel>
          </TabView>
        </>
      )}
    </div>
  );
};

export default Analytics; 