'use client'
import { Box } from '@mui/material'
import { useState } from 'react'
import DashboardAppBar from './AppBar'
import DashboardDrawer from './Drawer'
import DashboardFooter from './Footer'
import LoginDialog from './LoginDialog'
import PasswordDialog from './PasswordDialog'
import { useSoftUIController } from '@/context'
import { colors } from '@/styles/colors'

export default function DashboardLayout({ children }) {
  const [controller] = useSoftUIController()
  const { miniSidenav } = controller
  const [darkMode, setDarkMode] = useState(false)
  const [openLoginDialog, setOpenLoginDialog] = useState(false)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)

  const toggleDarkMode = () => setDarkMode(!darkMode)
  
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
        {children}
        
        <LoginDialog 
          open={openLoginDialog} 
          setOpen={setOpenLoginDialog}
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