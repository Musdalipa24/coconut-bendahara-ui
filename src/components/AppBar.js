'use client'
import { useState } from 'react'
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useSoftUIController, setMiniSidenav } from '@/context'
import { usePathname } from 'next/navigation'
import { menuItems } from '@/config/menuItems'

export default function DashboardAppBar({ darkMode, toggleDarkMode, setOpenPasswordDialog }) {
  const [controller, dispatch] = useSoftUIController()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const pathname = usePathname()

  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const handleDrawerToggle = () => setMiniSidenav(dispatch, !controller.miniSidenav)

  return (
    <AppBar position="fixed" sx={{ 
      width: {
        xs: '100%',
        sm: `calc(100% - ${controller.miniSidenav ? '50px' : '250px'})`
      },
      ml: {
        xs: 0,
        sm: controller.miniSidenav ? '80px' : '280px'
      },
      background: darkMode 
        ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(60, 60, 60, 0.4) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 250, 0.4) 100%)',
      backdropFilter: 'blur(20px)',
      border: darkMode 
        ? '1px solid rgba(255, 255, 255, 0.1)' 
        : '1px solid rgba(255, 255, 255, 0.8)',
      borderTop: 'none',
      boxShadow: darkMode 
        ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
        : '0 8px 32px rgba(0, 0, 0, 0.1)',
      color: darkMode ? '#fff' : '#1976d2',
    }}>
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
            fontWeight: 700,
            background: darkMode 
              ? 'linear-gradient(45deg, #64b5f6, #90caf9, #42a5f5)'
              : 'linear-gradient(45deg, #1976d2, #42a5f5, #1e88e5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            ml: '20px',
            fontSize: '1.4rem',
            letterSpacing: '-0.02em',
          }}
        >
          {menuItems.find(item => item.path === pathname)?.text || 'Dashboard'}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={handleClick}
            sx={{ 
              color: 'inherit',
              background: darkMode 
                ? 'rgba(100, 181, 246, 0.1)' 
                : 'rgba(25, 118, 210, 0.1)',
              backdropFilter: 'blur(10px)',
              border: darkMode 
                ? '1px solid rgba(144, 202, 249, 0.3)' 
                : '1px solid rgba(25, 118, 210, 0.2)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: darkMode 
                  ? 'rgba(144, 202, 249, 0.2)' 
                  : 'rgba(25, 118, 210, 0.15)',
                transform: 'translateY(-2px)',
                boxShadow: darkMode 
                  ? '0 8px 25px rgba(100, 181, 246, 0.3)' 
                  : '0 8px 25px rgba(25, 118, 210, 0.2)',
              }
            }}
            aria-controls={open ? 'settings-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <SettingsIcon sx={{ fontSize: 24 }} />
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
                borderRadius: '16px',
                minWidth: '200px',
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(60, 60, 60, 0.8) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.8) 100%)',
                backdropFilter: 'blur(20px)',
                border: darkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: darkMode 
                  ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: darkMode ? '#fff' : '#1976d2',
              }
            }}
          >
            <MenuItem 
              onClick={toggleDarkMode}
              sx={{
                borderRadius: '8px',
                margin: '4px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: darkMode 
                    ? 'rgba(100, 181, 246, 0.1)' 
                    : 'rgba(25, 118, 210, 0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ color: darkMode ? '#90caf9' : '#1976d2' }}>
                {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText sx={{ color: darkMode ? '#fff' : '#1976d2' }}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => {
                setOpenPasswordDialog(true)
                handleClose()
              }}
              sx={{
                borderRadius: '8px',
                margin: '4px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: darkMode 
                    ? 'rgba(100, 181, 246, 0.1)' 
                    : 'rgba(25, 118, 210, 0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ color: darkMode ? '#90caf9' : '#1976d2' }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText sx={{ color: darkMode ? '#fff' : '#1976d2' }}>
                Ganti Password
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}