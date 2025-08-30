'use client'
import { Drawer, Box, Toolbar, Typography, List, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import MenuItems from './MenuItems'
import { useSoftUIController, setMiniSidenav } from '@/context'

export default function DashboardDrawer({ darkMode, miniSidenav }) {
  const [controller, dispatch] = useSoftUIController()

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={miniSidenav}
        onClose={() => setMiniSidenav(dispatch, false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(60, 60, 60, 0.8) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.1)',
            borderLeft: 'none',
            color: darkMode ? '#fff' : '#1976d2',
            transition: 'all 0.3s ease',
            width: 260,
          },
        }}
      >
        <DrawerContent darkMode={darkMode} dispatch={dispatch} />
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(60, 60, 60, 0.8) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.1)',
            borderLeft: 'none',
            color: darkMode ? '#fff' : '#1976d2',
            transition: 'all 0.3s ease',
            width: miniSidenav ? 80 : 280,
          },
        }}
        open
      >
        <DrawerContent darkMode={darkMode} miniSidenav={miniSidenav} />
      </Drawer>
    </>
  )
}

function DrawerContent({ darkMode, miniSidenav, dispatch }) {
  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'transparent',
      color: darkMode ? '#fff' : '#1976d2',
      transition: 'all 0.3s ease',
    }}>
      <Toolbar sx={{ 
        px: 2, 
        py: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative',
        borderBottom: darkMode 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(0, 0, 0, 0.1)',
      }}>
        <Image
          src="/logo-lanscape.png"
          alt="COCONUT Logo"
          style={{ 
            maxWidth: '100%', 
            height: 'auto', 
            display: 'block', 
            padding: '4px',
            filter: darkMode ? 'brightness(1.2)' : 'none',
          }}
          width={140}
          height={50}
        />

        {/* Tombol Close hanya muncul di mobile */}
        {dispatch && (
          <IconButton
            edge="end"
            onClick={() => setMiniSidenav(dispatch, false)}
            sx={{ 
              display: { xs: 'flex', sm: 'none' }, 
              position: 'absolute',
              right: 16,
              color: darkMode ? '#90caf9' : '#1976d2',
              background: darkMode 
                ? 'rgba(100, 181, 246, 0.1)' 
                : 'rgba(25, 118, 210, 0.1)',
              borderRadius: '8px',
              '&:hover': {
                background: darkMode 
                  ? 'rgba(144, 202, 249, 0.2)' 
                  : 'rgba(25, 118, 210, 0.15)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>

      <Box sx={{ 
        px: 3, 
        mb: 2, 
        mt: 2,
        borderRadius: '12px',
        background: darkMode 
          ? 'rgba(100, 181, 246, 0.1)' 
          : 'rgba(25, 118, 210, 0.05)',
        mx: 2,
        py: 1,
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: darkMode ? '#90caf9' : '#1976d2',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
        >
          MENU BENDAHARA
        </Typography>
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        <MenuItems darkMode={darkMode} miniSidenav={miniSidenav} />
      </List>
    </Box>
  )
}