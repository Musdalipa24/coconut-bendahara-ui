const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8087';

export const transaksiService = {
    /**
     * Get all transaction history
     * @returns {Promise<Array>} Array of transaction records
     */
    getAllTransaksi: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/transaksi/getall`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data transaksi');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getAllTransaksi:', error);
            throw error;
        }
    },

    /**
     * Get last transaction
     * @returns {Promise<Object>} Last transaction record
     */
    getLastTransaksi: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/transaksi/getlast`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil transaksi terakhir');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getLastTransaksi:', error);
            throw error;
        }
    }
};