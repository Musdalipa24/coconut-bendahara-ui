'use client'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box
} from '@mui/material'
import { useState } from 'react'
import { authService } from '@/services/authService'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'

export default function LoginDialog({ open, setOpen }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await authService.login(username, password)
    if (result.success) {
      setLoggedIn(true)
      setOpen(false)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (!loggedIn) return // blokir close jika belum login
        setOpen(false)
      }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(50px)',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
          color: 'white',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
        }}
      >
        Login
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 5 }}>
            <PersonIcon sx={{ color: 'gray', mr: 1 }} />
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LockIcon sx={{ color: 'gray', mr: 1 }} />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Box>
          <DialogActions sx={{ px: 0 }}>
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 2,
                py: 1.2,
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}