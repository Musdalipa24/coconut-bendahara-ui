'use client'

import { AppBar, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Box, Menu, MenuItem, Container, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PaymentsIcon from '@mui/icons-material/Payments'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AssessmentIcon from '@mui/icons-material/Assessment'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSoftUIController, setMiniSidenav } from '@/context'
import { colors, shadows } from '@/styles/colors'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { authService } from '@/services/authService'

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Pemasukan', icon: <PaymentsIcon />, path: '/pemasukan' },
  { text: 'Pengeluaran', icon: <ReceiptIcon />, path: '/pengeluaran' },
  { text: 'Laporan Keuangan', icon: <AssessmentIcon />, path: '/laporan' },
]

export default function DashboardLayout({ children }) {
  const [controller, dispatch] = useSoftUIController()
  const { miniSidenav } = controller
  const pathname = usePathname()
  const [anchorEl, setAnchorEl] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode')
      return savedMode ? JSON.parse(savedMode) : false
    }
    return false
  })
  const [user, setUser] = useState(null)
  const router = useRouter()
  const open = Boolean(anchorEl)
  // State untuk dialog login
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn !== 'true') {
        setOpenLoginDialog(true);
      }
    }
  }, []);
  // Fungsi login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    const result = await authService.login(username, password);
    if (result.success) {
      localStorage.setItem('isLoggedIn', 'true');
      setOpenLoginDialog(false);
      setUsername('');
      setPassword('');
    } else {
      setLoginError(result.error || 'Username atau password salah!');
    }
    setLoginLoading(false);
  };
  // State untuk dialog ganti password
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [alertPassword, setAlertPassword] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [])

  const handleDrawerToggle = () => {
    setMiniSidenav(dispatch, !miniSidenav)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
    setAnchorEl(null);
  }
  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setAlertPassword({ open: false, message: '', severity: 'success' });
  }
  const handleSubmitPassword = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setAlertPassword({ open: true, message: 'Semua field harus diisi!', severity: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setAlertPassword({ open: true, message: 'Password baru dan konfirmasi tidak sama!', severity: 'error' });
      return;
    }
    setLoadingPassword(true);
    setTimeout(() => {
      setLoadingPassword(false);
      setAlertPassword({ open: true, message: 'Password berhasil diganti!', severity: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', JSON.stringify(newMode))
    handleClose()
  }

  const handleLogout = () => {
    Cookies.remove('isAuthenticated')
    localStorage.removeItem('user')
    router.push('http://localhost:5000')
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{
        display: 'flex',
        alignItems: 'center',
        px: 3,
        py: 2,
        minHeight: '80px !important'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/logo-lanscape.png"
            alt="COCONUT Logo"
            style={{ marginRight: '12px', maxWidth: '100%', height: 'auto', display: 'block' }}
            width={180}
            height={180}
          />
        </Box>
      </Toolbar>

      <Box sx={{ px: 3, mb: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: darkMode ? '#fff' : colors.text.secondary,
            fontWeight: 500,
            mb: 1
          }}
        >
          MENU BENDAHARA
        </Typography>
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            href={item.path}
            selected={pathname === item.path}
            sx={{
              borderRadius: '12px',
              mb: 1,
              py: 1,
              color: darkMode ? '#fff' : 'inherit',
              '&.Mui-selected': {
                bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : '#4caf50',
                color: darkMode ? '#fff' : '#fff',
                '& .MuiListItemIcon-root': {
                  color: darkMode ? '#fff' : '#fff',
                },
              },
              '&:hover': {
                bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#4caf50',
                color: '#fff',
                '& .MuiListItemIcon-root': {
                  color: '#fff',
                },
              },
            }}
          >
            <ListItemIcon sx={{
              minWidth: 40,
              color: darkMode ? '#fff' : (pathname === item.path ? colors.primary.main : colors.text.secondary)
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: pathname === item.path ? 600 : 400,
                  color: darkMode ? '#fff' : 'inherit',
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{
      display: 'flex',
      bgcolor: darkMode ? '#1a1a1a' : '#F8F9FA',
      minHeight: '100vh',
      color: darkMode ? '#fff' : colors.text.primary,
      transition: 'filter 0.3s',
      filter: openLoginDialog ? 'blur(20px)' : 'none',
      pointerEvents: openLoginDialog ? 'none' : 'auto',
    }}>
      <AppBar
        position="fixed"
        sx={{
          width: {
            xs: '100%',
            sm: `calc(100% - ${miniSidenav ? '80px' : '280px'})`
          },
          ml: {
            xs: 0,
            sm: miniSidenav ? '80px' : '280px'
          },
          bgcolor: darkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(6px)',
          color: darkMode ? '#fff' : colors.text.primary,
          boxShadow: 'none',
          '& .MuiIconButton-root': {
            color: darkMode ? '#fff' : colors.text.secondary,
          },
          transition: theme => theme.transitions.create(['margin', 'width', 'background-color', 'color'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{
          minHeight: { xs: '64px !important', sm: '80px !important' },
          px: { xs: 2, sm: 3 }
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: darkMode ? '#fff' : colors.text.primary
            }}
          >
            {menuItems.find(item => item.path === pathname)?.text || 'Dashboard'}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={handleClick}
              sx={{ color: 'inherit' }}
              aria-controls={open ? 'settings-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <SettingsIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <Menu
              id="settings-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'settings-button',
              }}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: '12px',
                  minWidth: '200px',
                  boxShadow: shadows.card,
                  bgcolor: darkMode ? '#1a1a1a' : 'white',
                  color: darkMode ? '#fff' : 'inherit',
                  '& .MuiListItemIcon-root': {
                    color: darkMode ? '#fff' : 'inherit',
                  },
                }
              }}
            >
              <MenuItem onClick={toggleDarkMode}>
                <ListItemIcon>
                  {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                </ListItemIcon>
                <ListItemText>{darkMode ? 'Light Mode' : 'Dark Mode'}</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleOpenPasswordDialog}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Ganti Password</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={miniSidenav}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: { xs: '240px', sm: '280px' },
            bgcolor: darkMode ? '#1a1a1a' : 'white',
            borderRight: 'none',
            boxShadow: shadows.card,
            color: darkMode ? '#fff' : colors.text.primary,
            '& .MuiListItemIcon-root': {
              color: darkMode ? '#fff' : colors.text.secondary,
            },
            transition: theme => theme.transitions.create(['background-color', 'color'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: miniSidenav ? '80px' : '280px',
            bgcolor: darkMode ? '#1a1a1a' : 'white',
            borderRight: 'none',
            boxShadow: shadows.card,
            color: darkMode ? '#fff' : colors.text.primary,
            '& .MuiListItemIcon-root': {
              color: darkMode ? '#fff' : colors.text.secondary,
            },
            transition: theme => theme.transitions.create(['width', 'background-color', 'color'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        mt: '80px',
        ml: { xs: 0, sm: miniSidenav ? '80px' : '280px' },
        width: { xs: '100%', sm: `calc(100% - ${miniSidenav ? '80px' : '280px'})` },
        transition: theme => theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 80px)',
      }}>
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>

        {/* Dialog Login */}
        <Dialog open={openLoginDialog} maxWidth="xs" fullWidth>
          <DialogTitle>Login Bendahara</DialogTitle>
          <DialogContent>
            {loginError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setLoginError('')}>
                {loginError}
              </Alert>
            )}
            <Box component="form" onSubmit={handleLoginSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                fullWidth
              />
              <DialogActions sx={{ px: 0 }}>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loginLoading}>
                  {loginLoading ? 'Memproses...' : 'Login'}
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Dialog Ganti Password */}
        <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="xs" fullWidth>
          <DialogTitle>Ganti Password</DialogTitle>
          <DialogContent>
            {alertPassword.open && (
              <Alert severity={alertPassword.severity} sx={{ mb: 2 }} onClose={() => setAlertPassword({ ...alertPassword, open: false })}>
                {alertPassword.message}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmitPassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Password Lama"
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Password Baru"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Konfirmasi Password Baru"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                fullWidth
              />
              <DialogActions sx={{ px: 0 }}>
                <Button onClick={handleClosePasswordDialog} color="secondary">Batal</Button>
                <Button type="submit" variant="contained" color="primary" disabled={loadingPassword}>
                  {loadingPassword ? 'Memproses...' : 'Ganti Password'}
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: darkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(6px)',
            borderTop: '1px solid',
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3} alignItems="center" justifyContent="space-between">
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2" color={darkMode ? '#fff' : 'text.secondary'}>
                    © {new Date().getFullYear()} Sistem Informasi Bendahara
                  </Typography>
                  <Link
                    href="https://coconut.or.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: darkMode ? '#90caf9' : '#1976d2' }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                    >
                      COCONUT Computer Club
                    </Typography>
                  </Link>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="body2" color={darkMode ? '#fff' : 'text.secondary'}>
                    Versi 1.0.0
                  </Typography>
                  <Typography variant="body2" color={darkMode ? '#fff' : 'text.secondary'}>
                    |
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color={darkMode ? '#fff' : 'text.secondary'}>
                      Crafted with ❤️ by hacklab
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  )
} 