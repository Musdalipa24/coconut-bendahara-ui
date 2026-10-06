import Cookies from 'js-cookie';

/**
 * Returns authorization headers with Bearer token if present
 * @returns {Object} Headers object
 */
export const getAuthHeaders = () => {
    const token = Cookies.get('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

