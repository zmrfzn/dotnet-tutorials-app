/* eslint-disable array-callback-return */

import TutorialService from "./TutorialService";
import Logger from "./Logger";

const mapCategories = async (tutorials) => {
  let categories = await getCategoriesFromCache();

  const updatedTutorials = tutorials.map((f) => {
    if (f.category) {
      let id = f.category;
      const matchedCategory = categories.find((c) => c.id == id);
      f.category = matchedCategory ? matchedCategory.category : `Unknown (${id})`;
    }
    return f;
  });

  return updatedTutorials;
};

// Function to format difficulty levels with proper capitalization
const mapDifficulty = (tutorials) => {
  if (!Array.isArray(tutorials)) {
    // Handle single tutorial object case
    if (tutorials && tutorials.difficulty) {
      tutorials.difficulty = formatDifficultyLevel(tutorials.difficulty);
      return tutorials;
    }
    return tutorials;
  }

  // Handle array of tutorials
  return tutorials.map(tutorial => {
    if (tutorial && tutorial.difficulty) {
      tutorial.difficulty = formatDifficultyLevel(tutorial.difficulty);
    }
    return tutorial;
  });
};

// Helper function to format a single difficulty value
const formatDifficultyLevel = (difficulty) => {
  if (!difficulty) return difficulty;
  
  // Ensure consistent formatting (lowercase)
  const lowerDifficulty = difficulty.toLowerCase();
  
  // Map to standard values if needed
  const difficultyMap = {
    'beginner': 'beginner',
    'easy': 'beginner',
    'intermediate': 'intermediate',
    'medium': 'intermediate',
    'advanced': 'advanced',
    'hard': 'advanced',
    'expert': 'advanced'
  };
  
  return difficultyMap[lowerDifficulty] || lowerDifficulty;
};

const setCategories = async (data) => {
  Logger.info(`Setting categories cache`);

  const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  const cache = {
    "expiry": expiry,
    "data": JSON.stringify(data)
  }
  localStorage.setItem('categories', JSON.stringify(cache));
}

const getCategoriesFromCache = async () => {
  Logger.info(`Getting categories from cache`);
  // window.newrelic.log('Getting categories from cache', {level: 'info'});

  const item = localStorage.getItem('categories');
  
  if (!item) {
    // If cache doesn't exist, fetch from API
    try {
      const response = await TutorialService.getCategories();
      return response;
    } catch (error) {
      Logger.error("Error fetching categories:", error);
      return []; // Return empty array as fallback
    }
  }
  
  try {
    const parsedItem = JSON.parse(item);
    return JSON.parse(parsedItem.data);
  } catch (error) {
    Logger.error("Error parsing categories cache:", error);
    return [];
  }
}

const isCategoriesValid = async () => {
  const item = localStorage.getItem('categories');

  if (!item) {
    Logger.info('Categories cache not found');
    return false;
  }

  try {
    const parsedItem = JSON.parse(item);
    const isValid = parsedItem && parsedItem.expiry && Date.now() < parsedItem.expiry;
    
    Logger.info(`Categories cache is ${isValid ? 'valid' : 'expired'}`);
    return isValid;
  } catch (error) {
    Logger.error("Error checking categories cache validity:", error);
    return false;
  }
}


export {
  mapCategories,
  mapDifficulty,
  formatDifficultyLevel,
  setCategories,
  getCategoriesFromCache,
  isCategoriesValid
};