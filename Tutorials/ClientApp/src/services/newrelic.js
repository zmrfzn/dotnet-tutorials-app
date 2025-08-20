// New Relic Browser instrumentation
const newrelic = window.newrelic;

// Page Access Tracking
export const trackPageAccess = (pageName, additionalData = {}) => {
  if (!newrelic) return;

  // Add custom attributes for page access
  newrelic.setCustomAttribute('pageName_custom', pageName);
  newrelic.setCustomAttribute('accessTimestamp_custom', new Date().toISOString());
  newrelic.setCustomAttribute('userAgent_custom', navigator.userAgent);
  newrelic.setCustomAttribute('screenResolution_custom', `${window.screen.width}x${window.screen.height}`);

  // Record custom event for page access
  newrelic.recordCustomEvent('PageAccessEvent_custom', {
    pageName,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    referrer: document.referrer,
    ...additionalData
  });
};

// Analytics Events
export const trackAnalyticsInteraction = (action, data) => {
  if (!newrelic) return;

  newrelic.setCustomAttribute('analyticsAction_custom', action);
  newrelic.setCustomAttribute('analyticsTimestamp_custom', new Date().toISOString());

  // Record custom event for analytics interactions
  newrelic.recordCustomEvent('AnalyticsInteraction_custom', {
    action,
    ...data,
    timestamp: new Date().toISOString()
  });
};

// Specific analytics events
export const trackTimeRangeChange = (timeRange) => {
  trackAnalyticsInteraction('timeRangeChange_custom', {
    timeRange,
    context: 'analytics'
  });
};

export const trackCategoryFilter = (category) => {
  trackAnalyticsInteraction('categoryFilter_custom', {
    category: category?.category || 'All Categories',
    context: 'analytics'
  });
};

export const trackAnalyticsView = (viewName) => {
  trackAnalyticsInteraction('viewChange_custom', {
    view: viewName,
    context: 'analytics'
  });
};

// Error tracking
export const trackAnalyticsError = (error, context) => {
  if (!newrelic) return;

  newrelic.noticeError(error, {
    context: `${context}_custom`,
    location: 'analytics',
    timestamp: new Date().toISOString()
  });
};