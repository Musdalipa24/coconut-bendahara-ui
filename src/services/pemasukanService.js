// Fungsi untuk memformat tanggal dari datetime-local ke format backend
const formatDateForBackend = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('Format tanggal tidak valid');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8087'; // Fallback jika env tidak ditemukan

export const pemasukanService = {
    /**
     * Add new income record with form data
     * @param {Object} data - Income data
     * @returns {Promise<Object>} Response data
     */
    async addPemasukan(data) {
        try {
            const formData = new FormData();
            formData.append('tanggal', formatDateForBackend(data.tanggal));
            formData.append('nominal', Number(data.nominal.toString().replace(/\D/g, '')));
            formData.append('kategori', data.kategori.trim());
            formData.append('keterangan', data.keterangan.trim());
            if (data.nota instanceof File) {
                formData.append('nota', data.nota);
            }

            const response = await fetch(`${API_BASE_URL}/api/pemasukan/add`, {
                method: 'POST',
                body: formData, // Tidak perlu set Content-Type, browser akan handle multipart/form-data
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal menambah pemasukan');
            }

            return {
                success: true,
                data: result.data,
                message: 'Pemasukan berhasil ditambahkan'
            };
        } catch (error) {
            console.error('Error in addPemasukan:', error);
            throw error;
        }
    },

    /**
     * Update income record with form data
     * @param {string} id - Record ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} Response data
     */
    async updatePemasukan(id, data) {
        try {
            const formData = new FormData();
            formData.append('tanggal', formatDateForBackend(data.tanggal));
            formData.append('nominal', Number(data.nominal.toString().replace(/\D/g, '')));
            formData.append('kategori', data.kategori.trim());
            formData.append('keterangan', data.keterangan.trim());
            if (data.nota instanceof File) {
                formData.append('nota', data.nota);
            } else if (data.nota === null) {
                formData.append('nota', ''); // Untuk menghapus nota jika null
            }

            const response = await fetch(`${API_BASE_URL}/api/pemasukan/update/${id}`, {
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal mengupdate pemasukan');
            }

            return {
                success: true,
                data: result.data,
                message: result.message || 'Pemasukan berhasil diupdate'
            };
        } catch (error) {
            console.error('Error in updatePemasukan:', error);
            throw error;
        }
    },

    /**
     * Delete income record
     * @param {string} id - Record ID
     * @returns {Promise<Object>} Response data
     */
    async deletePemasukan(id) {
        try {
            if (!id) {
                throw new Error('ID tidak valid');
            }

            const response = await fetch(`${API_BASE_URL}/api/pemasukan/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus pemasukan');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in deletePemasukan:', error);
            throw error;
        }
    },

    /**
     * Get all income records
     * @returns {Promise<Array>} Array of income records
     */
    async getAllPemasukan(page, pageSize) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/pemasukan/getall?page=${page}&page_size=${pageSize}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pemasukan');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getAllPemasukan:', error);
            throw error;
        }
    },

    /**
     * Get income record by ID
     * @param {string} id - Record ID
     * @returns {Promise<Object>} Income record
     */
    async getPemasukanById(id) {
        try {
            if (!id) {
                throw new Error('ID tidak valid');
            }

            const response = await fetch(`${API_BASE_URL}/api/pemasukan/get/${id}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pemasukan');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getPemasukanById:', error);
            throw error;
        }
    },

    /**
     * Get income records by date range (ditambahkan karena disebut di page.js)
     * @param {string} start - Tanggal mulai (YYYY-MM-DD)
     * @param {string} end - Tanggal akhir (YYYY-MM-DD)
     * @param {number} page - Halaman
     * @param {number} pageSize - Ukuran halaman
     * @returns {Promise<Object>} Data pemasukan
     */
    async getPemasukanByDateRange(start, end, page, pageSize) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/pemasukan/get-by-date-range?start=${start}&end=${end}&page=${page}&page_size=${pageSize}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pemasukan berdasarkan rentang tanggal');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getPemasukanByDateRange:', error);
            throw error;
        }
    }
};

export const UPLOAD_URL = `${API_BASE_URL}/api/uploads/`;