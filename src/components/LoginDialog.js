'use client'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert } from '@mui/material'
import { useState } from 'react'
import { authService } from '@/services/authService'

export default function LoginDialog({ open, setOpen }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await authService.login(username, password)
    if (result.success) {
      setOpen(false)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <DialogActions>
            <Button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}