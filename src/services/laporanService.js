import { getHeaders } from '@/config/api'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8087'

export const laporanService = {
    getAllLaporan: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/laporan/getall`, {
                method: 'GET',
                credentials: 'include'
            })
            if (!response.ok) {
                let errorMessage = 'Gagal mengambil data laporan'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage
                }
                throw new Error(errorMessage)
            }
            const { data } = await response.json()
            return Array.isArray(data) ? data : []
        } catch (error) {
            console.error('Error in getAllLaporan:', error)
            throw error
        }
    },

    getSaldo: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/laporan/saldo`, {
                method: 'GET',
                credentials: 'include'
            })
            if (!response.ok) {
                let errorMessage = 'Gagal mengambil saldo'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage
                }
                throw new Error(errorMessage)
            }
            const result = await response.json()
            const saldo = result.data ?? result.saldo ?? result.total ?? 0
            if (!Number.isFinite(Number(saldo))) {
                console.warn('Saldo tidak valid:', saldo)
                return 0
            }
            return Number(saldo)
        } catch (error) {
            console.error('Error in getSaldo:', error.message)
            throw error
        }
    },

    getTotalPengeluaran: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/laporan/pengeluaran`, {
                method: 'GET',
                credentials: 'include'
            })
            if (!response.ok) {
                let errorMessage = 'Gagal mengambil total pengeluaran'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage
                }
                throw new Error(errorMessage)
            }
            const { total } = await response.json()
            return Number.isFinite(Number(total)) ? Number(total) : 0
        } catch (error) {
            console.error('Error in getTotalPengeluaran:', error)
            throw error
        }
    },

    getTotalPemasukan: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/laporan/pemasukan`, {
                method: 'GET',
                credentials: 'include'
            })
            if (!response.ok) {
                let errorMessage = 'Gagal mengambil total pemasukan'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage
                }
                throw new Error(errorMessage)
            }
            const { total } = await response.json()
            return Number.isFinite(Number(total)) ? Number(total) : 0
        } catch (error) {
            console.error('Error in getTotalPemasukan:', error)
            throw error
        }
    },

    getLaporanByDateRange: async (startDate, endDate) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/laporan/range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
                {
                    method: 'GET',
                    credentials: 'include'
                }
            )
            if (!response.ok) {
                let errorMessage = 'Gagal mengambil laporan berdasarkan rentang tanggal'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage
                }
                throw new Error(errorMessage)
            }
            const { data } = await response.json()
            return Array.isArray(data) ? data : []
        } catch (error) {
            console.error('Error in getLaporanByDateRange:', error)
            throw error
        }
    }
}