'use client'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert } from '@mui/material'
import { useState } from 'react'

export default function PasswordDialog({ open, setOpen }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validation and submission logic
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Ganti Password</DialogTitle>
      <DialogContent>
        {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Password Lama"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          {/* Other password fields */}
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Simpan'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}