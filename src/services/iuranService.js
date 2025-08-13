const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const iuranService = {
  async getAllMember() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/member/getall`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      // result.data berisi array anggota
      return result.data || [];
    } catch (error) {
      throw error;
    }
  },
  // ...tambahkan service lain di sini
};
