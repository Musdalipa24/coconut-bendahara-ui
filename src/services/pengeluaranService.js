import { getAuthHeaders } from '@/utils/authHeader';

// Fungsi untuk memformat tanggal ke format backend (YYYY-MM-DD HH:mm) dengan menyertakan waktu saat di-input
const formatDateForBackend = (dateString) => {
    if (!dateString) {
        throw new Error('Tanggal harus diisi');
    }

    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');

    // Jika format YYYY-MM-DD dari input type="date"
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString.trim())) {
        return `${dateString.trim()} ${currentHours}:${currentMinutes}`;
    }

    // Jika format ISO string (YYYY-MM-DDTHH:mm...)
    if (typeof dateString === 'string' && dateString.includes('T')) {
        const [datePart] = dateString.split('T');
        return `${datePart} ${currentHours}:${currentMinutes}`;
    }

    // Jika format YYYY-MM-DD HH:mm atau DD-MM-YYYY HH:mm
    if (typeof dateString === 'string' && dateString.includes(' ')) {
        const [datePart] = dateString.split(' ');
        const parts = datePart.split(/[-/]/);
        if (parts.length === 3) {
            if (parts[0].length === 4) {
                return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')} ${currentHours}:${currentMinutes}`;
            } else {
                return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')} ${currentHours}:${currentMinutes}`;
            }
        }
    }

    // Jika format DD-MM-YYYY
    if (typeof dateString === 'string' && dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            if (parts[0].length === 4) {
                return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')} ${currentHours}:${currentMinutes}`;
            } else {
                return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')} ${currentHours}:${currentMinutes}`;
            }
        }
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('Format tanggal tidak valid');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day} ${currentHours}:${currentMinutes}`;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8087'; // Fallback jika env tidak ditemukan

export const pengeluaranService = {
    /**
     * Add new expenditure record
     * @param {Object} data - Expenditure data
     * @returns {Promise<Object>} Response data
     */
    addPengeluaran: async (data) => {
        try {
            // Validation
            if (!data.tanggal || isNaN(Date.parse(data.tanggal))) {
                throw new Error('Format tanggal tidak valid');
            }

            const nominal = typeof data.nominal === 'string'
                ? parseInt(data.nominal.replace(/\D/g, ''))
                : parseInt(data.nominal);

            if (isNaN(nominal) || nominal <= 0) {
                throw new Error('Nominal harus berupa angka positif');
            }

            if (!data.keterangan?.trim()) {
                throw new Error('Keterangan tidak boleh kosong');
            }

            // Prepare FormData with properly formatted date
            const formData = new FormData();
            formData.append('tanggal', formatDateForBackend(data.tanggal)); // Formatted date
            formData.append('nominal', nominal);
            formData.append('keterangan', data.keterangan.trim());
            if (data.nota instanceof File) {
                formData.append('nota', data.nota); // File object
            }

            const response = await fetch(`${API_BASE_URL}/api/pengeluaran/add`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders()
                },
                body: formData,
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal menambah pengeluaran');
            }

            return {
                success: true,
                data: result.data,
                message: 'Pengeluaran berhasil ditambahkan'
            };
        } catch (error) {
            console.error('Error in addPengeluaran:', error);
            throw error;
        }
    },

    /**
     * Update expenditure record
     * @param {string} id - Record ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} Response data
     */
    updatePengeluaran: async (id, data) => {
        try {
            if (!id) {
                throw new Error('ID tidak valid');
            }

            // Validation
            if (!data.tanggal || isNaN(Date.parse(data.tanggal))) {
                throw new Error('Format tanggal tidak valid');
            }

            const nominal = typeof data.nominal === 'string'
                ? parseInt(data.nominal.replace(/\D/g, ''))
                : parseInt(data.nominal);

            if (isNaN(nominal) || nominal <= 0) {
                throw new Error('Nominal harus berupa angka positif');
            }

            if (!data.keterangan?.trim()) {
                throw new Error('Keterangan tidak boleh kosong');
            }

            // Prepare FormData with properly formatted date
            const formData = new FormData();
            formData.append('tanggal', formatDateForBackend(data.tanggal)); // Formatted date
            formData.append('nominal', nominal);
            formData.append('keterangan', data.keterangan.trim());

            if (data.nota) {
                formData.append('nota', data.nota);
            }

            const response = await fetch(`${API_BASE_URL}/api/pengeluaran/update/${id}`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders()
                },
                body: formData,
                credentials: 'include'
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Gagal mengupdate pengeluaran');
            }

            return {
                success: true,
                data: responseData.data,
                message: 'Pengeluaran berhasil diupdate'
            };
        } catch (error) {
            console.error('Error in updatePengeluaran:', error);
            throw error;
        }
    },

    /**
     * Delete expenditure record
     * @param {string} id - Record ID
     * @returns {Promise<Object>} Response data
     */
    deletePengeluaran: async (id) => {
        try {
            if (!id) {
                throw new Error('ID tidak valid');
            }

            const response = await fetch(`${API_BASE_URL}/api/pengeluaran/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    ...getAuthHeaders()
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus pengeluaran');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in deletePengeluaran:', error);
            throw error;
        }
    },

    /**
     * Get all expenditure records
     * @returns {Promise<Array>} Array of expenditure records
     */
    getAllPengeluaran: async (page = 1, pageSize = 10) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/pengeluaran/getall?page=${page}&page_size=${pageSize}`, {
                method: 'GET',
                headers: {
                    ...getAuthHeaders()
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pengeluaran');
            }

            return await response.json(); // Kembalikan seluruh response termasuk metadata pagination
        } catch (error) {
            console.error('Error in getAllPengeluaran:', error);
            throw error;
        }
    },

    /**
     * Get expenditure record by ID
     * @param {string} id - Record ID
     * @returns {Promise<Object>} Expenditure record
     */
    getPengeluaranById: async (id) => {
        try {
            if (!id) {
                throw new Error('ID tidak valid');
            }

            const response = await fetch(`${API_BASE_URL}/api/pengeluaran/get/${id}`, {
                method: 'GET',
                headers: {
                    ...getAuthHeaders()
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pengeluaran');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getPengeluaranById:', error);
            throw error;
        }
    }
};

export const UPLOAD_URL = `${API_BASE_URL}/api/uploads/`;