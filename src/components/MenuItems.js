'use client'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { menuItems } from '@/config/menuItems'

export default function MenuItems({ darkMode, miniSidenav }) {
    const pathname = usePathname()

    return (
        <>
            {menuItems.map((item) => (
                <ListItem
                    key={item.text}
                    component={Link}
                    href={item.path}
                    selected={pathname === item.path}
                    sx={{
                        borderRadius: '16px',
                        mb: 1.5,
                        py: 1.5,
                        px: 2,
                        color: darkMode ? '#fff' : '#1976d2',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        background: pathname === item.path 
                            ? (darkMode 
                                ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.3) 0%, rgba(144, 202, 249, 0.2) 100%)'
                                : 'linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(66, 165, 245, 0.1) 100%)')
                            : 'transparent',
                        border: pathname === item.path 
                            ? (darkMode 
                                ? '1px solid rgba(144, 202, 249, 0.3)' 
                                : '1px solid rgba(25, 118, 210, 0.2)')
                            : '1px solid transparent',
                        '&:hover': {
                            background: darkMode 
                                ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(144, 202, 249, 0.1) 100%)'
                                : 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.05) 100%)',
                            border: darkMode 
                                ? '1px solid rgba(144, 202, 249, 0.3)' 
                                : '1px solid rgba(25, 118, 210, 0.2)',
                            transform: 'translateX(4px)',
                            boxShadow: darkMode 
                                ? '0 4px 15px rgba(100, 181, 246, 0.2)' 
                                : '0 4px 15px rgba(25, 118, 210, 0.1)',
                            '& .MuiListItemIcon-root': {
                                color: darkMode ? '#90caf9' : '#1976d2',
                                transform: 'scale(1.1)',
                            },
                            '& .MuiListItemText-root': {
                                color: darkMode ? '#90caf9' : '#1976d2',
                            },
                        },
                        '&.Mui-selected': {
                            background: darkMode 
                                ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.3) 0%, rgba(144, 202, 249, 0.2) 100%)'
                                : 'linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(66, 165, 245, 0.1) 100%)',
                            border: darkMode 
                                ? '1px solid rgba(144, 202, 249, 0.4)' 
                                : '1px solid rgba(25, 118, 210, 0.3)',
                            '& .MuiListItemIcon-root': {
                                color: darkMode ? '#64b5f6' : '#1976d2',
                            },
                            '& .MuiListItemText-root': {
                                color: darkMode ? '#64b5f6' : '#1976d2',
                                fontWeight: 600,
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '4px',
                                borderRadius: '0 4px 4px 0',
                                background: darkMode 
                                    ? 'linear-gradient(135deg, #64b5f6, #90caf9)'
                                    : 'linear-gradient(135deg, #1976d2, #42a5f5)',
                            },
                        },
                    }}
                >
                    <ListItemIcon sx={{ 
                        minWidth: 40, 
                        color: pathname === item.path 
                            ? (darkMode ? '#64b5f6' : '#1976d2')
                            : (darkMode ? '#b0b0b0' : '#666666'),
                        transition: 'all 0.3s ease',
                    }}>
                        {item.icon}
                    </ListItemIcon>
                    {!miniSidenav && (
                        <ListItemText 
                            primary={item.text} 
                            sx={{
                                '& .MuiListItemText-primary': {
                                    fontWeight: pathname === item.path ? 600 : 500,
                                    fontSize: '0.95rem',
                                    color: pathname === item.path 
                                        ? (darkMode ? '#64b5f6' : '#1976d2')
                                        : (darkMode ? '#fff' : '#1976d2'),
                                    transition: 'all 0.3s ease',
                                }
                            }}
                        />
                    )}
                </ListItem>
            ))}
        </>
    )
}