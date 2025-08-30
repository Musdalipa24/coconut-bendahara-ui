'use client'
import { Box, ThemeProvider, createTheme } from '@mui/material'
import { useState, useEffect } from 'react'
import DashboardAppBar from './AppBar'
import DashboardDrawer from './Drawer'
import DashboardFooter from './Footer'
import LoginDialog from './LoginDialog'
import PasswordDialog from './PasswordDialog'
import { useSoftUIController, setDarkMode } from '@/context'
import { colors } from '@/styles/colors'
import Cookies from 'js-cookie'

// Custom theme untuk dark mode yang konsisten dengan laporan
const createCustomTheme = (isDark) => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    primary: {
      main: isDark ? '#64b5f6' : '#1976d2',
      light: isDark ? '#90caf9' : '#42a5f5',
      dark: isDark ? '#1976d2' : '#0d47a1',
    },
    secondary: {
      main: isDark ? '#f48fb1' : '#dc004e',
    },
    background: {
      default: isDark ? '#0a0a0a' : '#f5f5f5',
      paper: isDark ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: isDark ? '#ffffff' : '#000000',
      secondary: isDark ? '#b0b0b0' : '#666666',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: isDark 
            ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          backdropFilter: 'blur(10px)',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
        }
      }
    }
  }
});

// 🧠 Tambahan untuk parsing & cek expired
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
}

function isTokenExpired(token) {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

export default function DashboardLayout({ children }) {
  const [controller, dispatch] = useSoftUIController()
  const { miniSidenav, darkMode } = controller
  const [openLoginDialog, setOpenLoginDialog] = useState(false)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const toggleDarkMode = () => setDarkMode(dispatch, !darkMode)
  const customTheme = createCustomTheme(darkMode)

  useEffect(() => {
    const token = Cookies.get('authToken')
    if (!token || isTokenExpired(token)) {
      Cookies.remove('authToken')
      setOpenLoginDialog(true)
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{
        display: 'flex',
        minHeight: '100vh',
        background: darkMode 
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? 'radial-gradient(circle at 25% 25%, rgba(100, 181, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(244, 143, 177, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 25% 25%, rgba(25, 118, 210, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(220, 0, 78, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}>
        <DashboardAppBar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          setOpenPasswordDialog={setOpenPasswordDialog}
        />
        
        <DashboardDrawer darkMode={darkMode} miniSidenav={miniSidenav} />
        
        <Box sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: '64px',
          ml: { xs: 0, sm: miniSidenav ? '80px' : '280px' },
          width: { xs: '100%', sm: `calc(100% - ${miniSidenav ? '80px' : '280px'})` },
          position: 'relative',
          zIndex: 1,
        }}>
          
          {isAuthenticated && children}

          <LoginDialog 
            open={openLoginDialog} 
            setOpen={(val) => {
              setOpenLoginDialog(val)
              if (!val) {
                const token = Cookies.get('authToken')
                if (token && !isTokenExpired(token)) {
                  setIsAuthenticated(true)
                }
              }
            }}
          />
          
          <PasswordDialog 
            open={openPasswordDialog}
            setOpen={setOpenPasswordDialog}
          />
          
          <DashboardFooter darkMode={darkMode} />
        </Box>
      </Box>
    </ThemeProvider>
  )
}