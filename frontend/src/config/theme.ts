/**
 * FitActive theme configuration
 */
export const theme = {
  colors: {
    primary: {
      orange: '#EC7C26',
      orange600: '#EC7C26',
      ral2011: '#EC7C26',
    },
    neutral: {
      dark: '#111111',
      ral9011: '#1C1C1C',
      gray: '#1F2937',
      light: '#F8FAFC',
      white: '#FFFFFF',
      black: '#000000',
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
} as const;

/**
 * CSS custom properties for the theme
 */
export const cssVariables = `
  :root {
    --fa-orange: ${theme.colors.primary.orange};
    --fa-orange-600: ${theme.colors.primary.orange600};
    --fa-ral-2011: ${theme.colors.primary.ral2011};
    --fa-ral-9011: ${theme.colors.neutral.ral9011};
    --fa-dark: ${theme.colors.neutral.dark};
    --fa-gray: ${theme.colors.neutral.gray};
    --fa-light: ${theme.colors.neutral.light};
    --fa-white: ${theme.colors.neutral.white};
  }
`;
