'use client'
import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import DashboardAppBar from './AppBar'
import DashboardDrawer from './Drawer'
import DashboardFooter from './Footer'
import LoginDialog from './LoginDialog'
import PasswordDialog from './PasswordDialog'
import { useSoftUIController } from '@/context'
import { colors } from '@/styles/colors'
import Cookies from 'js-cookie'

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
  const [controller] = useSoftUIController()
  const { miniSidenav } = controller
  const [darkMode, setDarkMode] = useState(false)
  const [openLoginDialog, setOpenLoginDialog] = useState(false)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const toggleDarkMode = () => setDarkMode(!darkMode)

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
    <Box sx={{
      display: 'flex',
      bgcolor: darkMode ? '#1a1a1a' : '#F8F9FA',
      minHeight: '100vh',
      color: darkMode ? '#fff' : colors.text.primary,
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
        mt: '80px',
        ml: { xs: 0, sm: miniSidenav ? '80px' : '280px' },
        width: { xs: '100%', sm: `calc(100% - ${miniSidenav ? '80px' : '280px'})` },
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
  )
}