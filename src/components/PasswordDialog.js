'use client'
import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert } from '@mui/material'
import { authService } from '@/services/authService'

export default function PasswordDialog({ open, setOpen }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAlert(null)

    if (!oldPassword || !newPassword || !confirmPassword) {
      setAlert({ severity: 'error', message: 'Semua field wajib diisi.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setAlert({ severity: 'error', message: 'Konfirmasi password tidak cocok.' })
      return
    }

    setLoading(true)

    try {
      const result = await authService.updatePassword(oldPassword, newPassword)

      if (result.success) {
        setAlert({ severity: 'success', message: result.message || 'Password berhasil diperbarui.' })
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        // Tutup pop-up otomatis setelah 1 detik
        setTimeout(() => setOpen(false), 1000)
      } else {
        setAlert({ severity: 'error', message: result.error || 'Gagal memperbarui password.' })
      }
    } catch (error) {
      setAlert({ severity: 'error', message: 'Terjadi kesalahan server.' })
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Ganti Password</DialogTitle>
      <DialogContent>
        {alert && <Alert severity={alert.severity} sx={{ mb: 2 }}>{alert.message}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Password Lama"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password Baru"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Konfirmasi Password Baru"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={loading}>Batal</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Loading...' : 'Simpan'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}