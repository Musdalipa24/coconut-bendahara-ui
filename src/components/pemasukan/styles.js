import { styled } from '@mui/material/styles'

export const IuranButton = styled('button')(({ theme }) => ({
  backgroundColor: '#2e7d32',
  color: 'white',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  fontSize: '1rem',
  boxShadow: '0 2px 8px rgba(46,125,50,0.15)',
  '&:hover': {
    backgroundColor: '#1b5e20',
    boxShadow: '0 4px 12px rgba(46,125,50,0.25)',
    transform: 'translateY(-1px)'
  },
  '&:active': {
    transform: 'translateY(0)'
  },
  transition: 'all 0.2s ease',
}))

export const StyledCard = styled('div')(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden'
}))

export const DesktopAddButton = styled('button')(({ theme }) => ({
  backgroundColor: 'white',
  color: '#2e7d32',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  width: '100%',
  fontSize: '1rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transform: 'translateY(-1px)'
  },
  '&:active': {
    transform: 'translateY(0)'
  },
  transition: 'all 0.2s ease',
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}))

export const AddButton = styled('button')(({ theme }) => ({
  backgroundColor: 'white',
  color: '#2e7d32',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  width: '100%',
  fontSize: '1rem',
  marginBottom: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transform: 'translateY(-1px)'
  },
  '&:active': {
    transform: 'translateY(0)'
  },
  transition: 'all 0.2s ease',
  [theme.breakpoints.up('sm')]: {
    display: 'none'
  }
}))

export const StyledFormControl = styled('div')(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    fontSize: '0.9rem',
    padding: '4px 8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    '& .MuiSelect-select': {
      padding: '8px 12px',
      paddingRight: '32px !important'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2e7d32',
      boxShadow: '0 0 0 3px rgba(46,125,50,0.1)'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2e7d32',
      borderWidth: '2px',
      boxShadow: '0 0 0 3px rgba(46,125,50,0.1)'
    },
    transition: 'all 0.2s ease'
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    color: '#666',
    transform: 'translate(14px, 10px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)',
      color: '#2e7d32'
    },
    '&.Mui-focused': {
      color: '#2e7d32'
    }
  },
  '& .MuiSvgIcon-root': {
    color: '#2e7d32'
  }
}))