import Cookies from 'js-cookie';

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.error('Invalid token', e);
        return null;
    }
}

export const authService = {
    login: async (username, password) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await fetch(`${apiUrl}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const responseData = await response.json();

            if (!response.ok || responseData.code !== 200) {
                return {
                    success: false,
                    error: responseData.message || 'Login gagal'
                };
            }

            const token = responseData.data;
            if (token) {
                Cookies.set('authToken', token, { expires: 7 });
            }

            return { success: true, data: { token } };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Terjadi kesalahan saat login. Silakan coba lagi.' };
        }
    },

    getUsernameFromToken: () => {
        const token = Cookies.get('authToken');
        if (!token) return null;
        const decoded = parseJwt(token);
        return decoded?.username || null;
    },

    updatePassword: async (oldPassword, newPassword) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = Cookies.get('authToken');
            if (!token) return { success: false, error: 'Token tidak ditemukan. Silakan login ulang.' };

            const username = authService.getUsernameFromToken();
            if (!username) return { success: false, error: 'Username tidak ditemukan di token' };

            const response = await fetch(`${apiUrl}/api/admin/update/${encodeURIComponent(username)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    password: newPassword
                })
            });

            const responseData = await response.json();

            if (!response.ok || responseData.code !== 200) {
                return {
                    success: false,
                    error: responseData.message || 'Gagal update password'
                };
            }

            Cookies.remove('authToken');

            return {
                success: true,
                data: responseData.data,
                message: responseData.message || 'Password berhasil diubah. Silakan login kembali.'
            };
        } catch (error) {
            console.error('Update password error:', error);
            return { success: false, error: 'Terjadi kesalahan saat update password. Silakan coba lagi.' };
        }
    }
};