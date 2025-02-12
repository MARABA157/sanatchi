export const theme = {
  colors: {
    // Ana renkler
    primary: {
      white: '#FFFFFF',
      black: '#000000',
      gold: '#FFD700',
    },
    // Aksan renkler
    accent: {
      softGray: '#F5F5F5',
      darkGray: '#333333',
      pastelBlue: '#E6F3FF',
    },
    // Gradyanlar
    gradient: {
      primary: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      dark: 'linear-gradient(135deg, #333333 0%, #000000 100%)',
      light: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
    },
  },
  
  typography: {
    // Başlıklar
    heading: {
      fontFamily: '"Playfair Display", serif',
      sizes: {
        h1: '48px',
        h2: '36px',
        h3: '24px',
      },
      weights: {
        regular: 400,
        bold: 700,
      },
    },
    // İçerik
    body: {
      fontFamily: '"Inter", sans-serif',
      sizes: {
        regular: '16px',
        small: '14px',
      },
      weights: {
        regular: 400,
        medium: 500,
        bold: 700,
      },
    },
    // Vurgular
    accent: {
      fontFamily: '"Montserrat", sans-serif',
      size: '18px',
      weight: 700,
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },

  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.1)',
    lg: '0 8px 16px rgba(0,0,0,0.1)',
    xl: '0 16px 32px rgba(0,0,0,0.1)',
  },

  transitions: {
    fast: '0.2s ease',
    medium: '0.3s ease',
    slow: '0.5s ease',
  },

  effects: {
    glassmorphism: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    hover: {
      scale: 'scale(1.05)',
      lift: 'translateY(-4px)',
    },
  },

  layout: {
    maxWidth: '1440px',
    gutter: '24px',
    radius: {
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
      full: '9999px',
    },
  },

  animations: {
    fadeIn: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
    slideUp: '@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }',
    slideDown: '@keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }',
    zoomIn: '@keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }',
  },
};
