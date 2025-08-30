import { styled, keyframes, Container, Typography, Card, Box, FormControl } from '@mui/material';

export const slideUp = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

export const AnimatedContainer = styled(Container)`
  animation: ${fadeIn} 0.5s ease-out;
`;

export const AnimatedTypography = styled(Typography)`
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite linear;
  }
`;

export const StyledCard = styled(Card)(({ theme, variant, delay = 0 }) => {
  // Define color themes for different variants
  const colorThemes = {
    income: {
      light: {
        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.15) 50%, rgba(102, 187, 106, 0.1) 100%)',
        border: 'rgba(76, 175, 80, 0.2)',
        shadow: 'rgba(76, 175, 80, 0.15)',
        textColor: '#2e7d32',
        subtitleColor: '#388e3c'
      },
      dark: {
        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(139, 195, 74, 0.25) 50%, rgba(102, 187, 106, 0.2) 100%)',
        border: 'rgba(76, 175, 80, 0.3)',
        shadow: 'rgba(76, 175, 80, 0.25)',
        textColor: '#81c784',
        subtitleColor: '#a5d6a7'
      }
    },
    expense: {
      light: {
        background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.15) 50%, rgba(239, 83, 80, 0.1) 100%)',
        border: 'rgba(244, 67, 54, 0.2)',
        shadow: 'rgba(244, 67, 54, 0.15)',
        textColor: '#d32f2f',
        subtitleColor: '#e53935'
      },
      dark: {
        background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(229, 57, 53, 0.25) 50%, rgba(239, 83, 80, 0.2) 100%)',
        border: 'rgba(244, 67, 54, 0.3)',
        shadow: 'rgba(244, 67, 54, 0.25)',
        textColor: '#e57373',
        subtitleColor: '#ffab91'
      }
    },
    default: {
      light: {
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(21, 101, 192, 0.15) 50%, rgba(30, 136, 229, 0.1) 100%)',
        border: 'rgba(25, 118, 210, 0.2)',
        shadow: 'rgba(25, 118, 210, 0.15)',
        textColor: '#1565c0',
        subtitleColor: '#1e88e5'
      },
      dark: {
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.2) 0%, rgba(21, 101, 192, 0.25) 50%, rgba(30, 136, 229, 0.2) 100%)',
        border: 'rgba(25, 118, 210, 0.3)',
        shadow: 'rgba(25, 118, 210, 0.25)',
        textColor: '#64b5f6',
        subtitleColor: '#90caf9'
      }
    }
  };

  const isDarkMode = theme.palette.mode === 'dark';
  const variantTheme = colorThemes[variant] || colorThemes.default;
  const modeTheme = isDarkMode ? variantTheme.dark : variantTheme.light;

  return {
    padding: theme.spacing(3),
    background: modeTheme.background,
    borderRadius: '20px',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${modeTheme.border}`,
    boxShadow: isDarkMode 
      ? `0 8px 32px ${modeTheme.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
      : `0 8px 32px ${modeTheme.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
    transition: 'all 0.3s ease',
    animation: `${slideUp} 0.5s ease-out ${delay}s both`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: isDarkMode 
        ? `0 12px 40px ${modeTheme.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.15)`
        : `0 12px 40px ${modeTheme.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.9)`,
    },
    '& .MuiTypography-h4': {
      color: modeTheme.textColor,
      fontWeight: 700,
      textShadow: isDarkMode 
        ? `0 2px 10px ${modeTheme.textColor}40` 
        : `0 2px 10px ${modeTheme.textColor}30`,
    },
    '& .MuiTypography-subtitle1': {
      color: modeTheme.subtitleColor,
      fontWeight: 600,
      letterSpacing: '0.5px',
    }
  };
});

export const IconWrapper = styled(Box)({
  position: 'absolute',
  right: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0.2,
  fontSize: 48,
});

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: theme.palette.background.paper,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976D2',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976D2',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: '#1976D2',
    },
  },
}));
