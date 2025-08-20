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
      bgcolor: darkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(6px)',
      color: darkMode ? '#fff' : 'inherit',
      boxShadow: 'none',
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
            fontWeight: 600,
            color: darkMode ? '#fff' : 'inherit',
            ml: '20px',
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
                bgcolor: darkMode ? '#1a1a1a' : 'white',
                color: darkMode ? '#fff' : 'inherit',
              }
            }}
          >
            <MenuItem onClick={toggleDarkMode}>
              <ListItemIcon sx={{ color: darkMode ? '#fff' : 'inherit' }}>
                {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText>{darkMode ? 'Light Mode' : 'Dark Mode'}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              setOpenPasswordDialog(true)
              handleClose()
            }}>
              <ListItemIcon sx={{ color: darkMode ? '#fff' : 'inherit' }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ganti Password</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}