const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Generate a new report
 * @param {Object} reportData - Report generation request
 * @returns {Promise<Object>} Generated report
 */
export const generateReport = async (reportData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/reports/?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate report: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Generate report error:', error);
    throw error;
  }
};

/**
 * Get all reports with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} List of reports with pagination
 */
export const getReports = async ({
  reportType = null,
  isFavorite = null,
  page = 1,
  pageSize = 20
} = {}) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const params = new URLSearchParams({ user_id: userId, page, page_size: pageSize });
    
    if (reportType) params.append('report_type', reportType);
    if (isFavorite !== null) params.append('is_favorite', isFavorite);

    const response = await fetch(
      `${API_BASE_URL}/reports/?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch reports: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get reports error:', error);
    throw error;
  }
};

/**
 * Get report statistics
 * @returns {Promise<Object>} Report statistics
 */
export const getReportStatistics = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/reports/statistics?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch statistics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get statistics error:', error);
    throw error;
  }
};

/**
 * Get a specific report by ID
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} Report details
 */
export const getReport = async (reportId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/reports/${reportId}?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch report: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get report error:', error);
    throw error;
  }
};

/**
 * Update a report
 * @param {string} reportId - Report ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated report
 */
export const updateReport = async (reportId, updateData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/reports/${reportId}?user_id=${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update report: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update report error:', error);
    throw error;
  }
};

/**
 * Delete a report
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} Success message
 */
export const deleteReport = async (reportId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/reports/${reportId}?user_id=${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete report: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete report error:', error);
    throw error;
  }
};

/**
 * Toggle favorite status of a report
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} Updated report
 */
export const toggleFavoriteReport = async (reportId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/reports/${reportId}/favorite?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to toggle favorite: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Toggle favorite error:', error);
    throw error;
  }
};

/**
 * Download report as PDF
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} PDF download info
 */
export const downloadReport = async (reportId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/reports/${reportId}/download?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download report: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Download report error:', error);
    throw error;
  }
};