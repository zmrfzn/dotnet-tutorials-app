import http from "../http-common";
import { getCategoriesFromCache, isCategoriesValid, setCategories } from "./Util";

const getAll = async () => {
  try {
    const response = await http.get("/tutorials");
    return {
      ...response,
      data: response.data
    };
  } catch (error) {
    console.error("Error in getAll:", error);
    throw error;
  }
};

const getCategories = async () => {
  try {
    // Check if we have valid cached categories
    if (await isCategoriesValid()) {
      const cachedData = await getCategoriesFromCache();
      console.log("Using cached categories data");
      return cachedData;
    } 
    
    // If no valid cache, fetch from API
    console.log("Fetching fresh categories data");
    const response = await http.get('/tutorials/categories');
    
    // Update cache with new data
    if (response.data && response.data.length > 0) {
      setCategories(response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error in getCategories:", error);
    // As fallback, try to use cached data even if expired
    try {
      return await getCategoriesFromCache();
    } catch (cacheError) {
      console.error("Couldn't get categories from cache either:", cacheError);
      return []; // Return empty array as last resort
    }
  }
};

const get = id => {
  return http.get(`/tutorials/${id}`);
};

const create = data => {
  return http.post("/tutorials", data);
};

const update = (id, data) => {
  return http.put(`/tutorials/${id}`, data);
};

const remove = id => {
  return http.delete(`/tutorials/${id}`);
};

const removeAll = () => {
  return http.delete(`/tutorials`);
};

const findByTitle = title => {
  return http.get(`/tutorials?title=${title}`);
};

const findAllPublished = () => {
  return http.get(`/tutorials/published`);
};

const findByDifficulty = difficulty => {
  return http.get(`/tutorials/difficulty/${difficulty}`);
};

const incrementViewCount = id => {
  return http.post(`/tutorials/${id}/view`);
};

const incrementLikes = id => {
  return http.post(`/tutorials/${id}/like`, { increment: true });
};

const decrementLikes = id => {
  return http.post(`/tutorials/${id}/like`, { increment: false });
};

const TutorialService = {
  getAll,
  get,
  getCategories,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
  findAllPublished,
  findByDifficulty,
  incrementViewCount,
  incrementLikes,
  decrementLikes
};

export default TutorialService;