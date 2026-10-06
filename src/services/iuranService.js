import { getAuthHeaders } from '@/utils/authHeader';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const iuranService = {
  async getAllMember() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/member/getall`, {
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      throw error;
    }
  },

  async addMember(memberData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/member/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify(memberData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Network response was not ok');
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  async updateMemberIuran(id_member, iuranData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/member/update/${id_member}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify(iuranData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Network response was not ok');
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteMember(id_member) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/member/delete/${id_member}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include',
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Network response was not ok');
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  async reactivateMember(id_member, status = 'anggota') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/member/reactivate/${id_member}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Network response was not ok');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
};