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
            bgcolor: darkMode ? '#1a1a1a' : 'white',
            color: darkMode ? '#fff' : 'inherit',
            transition: 'background-color 0.3s, color 0.3s',
            width: 260, // biar lebih pas
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
            bgcolor: darkMode ? '#1a1a1a' : 'white',
            color: darkMode ? '#fff' : 'inherit',
            transition: 'background-color 0.3s, color 0.3s',
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
      bgcolor: darkMode ? '#1a1a1a' : 'white',
      color: darkMode ? '#fff' : 'inherit',
      transition: 'background-color 0.3s, color 0.3s',
    }}>
      <Toolbar sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Image
          src="/logo-lanscape.png"
          alt="COCONUT Logo"
          style={{ marginRight: '12px', maxWidth: '100%', height: 'auto', display: 'block', padding: '4px' }}
          width={140}
          height={50}
        />

        {/* Tombol Close hanya muncul di mobile */}
        {dispatch && (
          <IconButton
            edge="end"
            onClick={() => setMiniSidenav(dispatch, false)}
            sx={{ display: { xs: 'flex', sm: 'none' }, color: darkMode ? '#fff' : 'inherit' }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>

      <Box sx={{ px: 3, mb: 2 }}>
        <Typography variant="body2" sx={{ color: darkMode ? '#fff' : 'inherit' }}>
          MENU BENDAHARA
        </Typography>
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        <MenuItems darkMode={darkMode} miniSidenav={miniSidenav} />
      </List>
    </Box>
  )
}