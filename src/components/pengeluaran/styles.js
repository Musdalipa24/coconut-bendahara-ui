import { styled } from '@mui/material/styles'

export const StyledCard = styled('div')(({ theme }) => ({
  background: 'var(--card-bg, linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 250, 0.4) 100%))',
  backdropFilter: 'blur(20px)',
  border: 'var(--card-border, 1px solid rgba(255, 255, 255, 0.8))',
  borderRadius: '20px',
  boxShadow: 'var(--card-shadow, 0 8px 32px rgba(0, 0, 0, 0.1))',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  
  // Dark mode styles
  '.dark-mode &': {
    '--card-bg': 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(60, 60, 60, 0.4) 100%)',
    '--card-border': '1px solid rgba(255, 255, 255, 0.1)',
    '--card-shadow': '0 8px 32px rgba(0, 0, 0, 0.3)',
  }
}))

export const DesktopAddButton = styled('button')(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.7) 100%)',
  color: '#c62828',
  border: '1px solid rgba(198, 40, 40, 0.2)',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  width: '100%',
  fontSize: '1rem',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 16px rgba(198, 40, 40, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(198, 40, 40, 0.1) 0%, rgba(229, 57, 53, 0.05) 100%)',
    borderColor: '#c62828',
    boxShadow: '0 6px 20px rgba(198, 40, 40, 0.2)',
    transform: 'translateY(-2px)'
  },
  '&:active': {
    transform: 'translateY(0)'
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}))

export const AddButton = styled('button')(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.7) 100%)',
  color: '#c62828',
  border: '1px solid rgba(198, 40, 40, 0.2)',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  width: '100%',
  fontSize: '1rem',
  marginBottom: '16px',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 16px rgba(198, 40, 40, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(198, 40, 40, 0.1) 0%, rgba(229, 57, 53, 0.05) 100%)',
    borderColor: '#c62828',
    boxShadow: '0 6px 20px rgba(198, 40, 40, 0.2)',
    transform: 'translateY(-2px)'
  },
  '&:active': {
    transform: 'translateY(0)'
  },
  [theme.breakpoints.up('sm')]: {
    display: 'none'
  }
}))

export const StyledFormControl = styled('div')(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.7) 100%)',
    backdropFilter: 'blur(10px)',
    fontSize: '0.9rem',
    padding: '4px 8px',
    border: '1px solid rgba(198, 40, 40, 0.2)',
    boxShadow: '0 2px 8px rgba(198, 40, 40, 0.1)',
    transition: 'all 0.2s ease',
    '& .MuiSelect-select': {
      padding: '8px 12px',
      paddingRight: '32px !important'
    },
    '&:hover': {
      borderColor: '#c62828',
      boxShadow: '0 4px 12px rgba(198, 40, 40, 0.2)',
      background: 'linear-gradient(135deg, rgba(198, 40, 40, 0.05) 0%, rgba(229, 57, 53, 0.02) 100%)'
    },
    '&.Mui-focused': {
      borderColor: '#c62828',
      borderWidth: '2px',
      boxShadow: '0 0 0 3px rgba(198, 40, 40, 0.1)',
      background: 'linear-gradient(135deg, rgba(198, 40, 40, 0.08) 0%, rgba(229, 57, 53, 0.04) 100%)'
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    color: '#666',
    transform: 'translate(14px, 10px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)',
      color: '#c62828'
    },
    '&.Mui-focused': {
      color: '#c62828'
    }
  },
  '& .MuiSvgIcon-root': {
    color: '#c62828'
  }
}))