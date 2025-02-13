import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle\`
  /* Reset ve temel stiller */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.typography.body.fontFamily};
    font-size: ${theme.typography.body.sizes.regular};
    line-height: 1.5;
    color: ${theme.colors.accent.darkGray};
    background-color: ${theme.colors.primary.white};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Tipografi */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.typography.heading.fontFamily};
    font-weight: ${theme.typography.heading.weights.bold};
    line-height: 1.2;
    margin-bottom: ${theme.spacing.lg};
  }

  h1 {
    font-size: ${theme.typography.heading.sizes.h1};
  }

  h2 {
    font-size: ${theme.typography.heading.sizes.h2};
  }

  h3 {
    font-size: ${theme.typography.heading.sizes.h3};
  }

  p {
    margin-bottom: ${theme.spacing.md};
  }

  /* Linkler */
  a {
    color: inherit;
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primary.gold};
    }
  }

  /* Butonlar */
  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    transition: all ${theme.transitions.fast};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Görüntüler */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Form elemanları */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: 1px solid ${theme.colors.accent.softGray};
    border-radius: ${theme.layout.radius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    transition: all ${theme.transitions.fast};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary.gold};
      box-shadow: ${theme.shadows.sm};
    }
  }

  /* Scroll bar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.accent.softGray};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.accent.darkGray};
    border-radius: ${theme.layout.radius.full};
  }

  /* Seçim */
  ::selection {
    background: ${theme.colors.primary.gold};
    color: ${theme.colors.primary.white};
  }

  /* Animasyonlar */
  ${theme.animations.fadeIn}
  ${theme.animations.slideUp}
  ${theme.animations.slideDown}
  ${theme.animations.zoomIn}

  /* Container */
  .container {
    max-width: ${theme.layout.maxWidth};
    margin: 0 auto;
    padding: 0 ${theme.layout.gutter};
  }

  /* Grid sistem */
  .grid {
    display: grid;
    gap: ${theme.spacing.md};
  }

  /* Flex yardımcıları */
  .flex {
    display: flex;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Responsive yardımcıları */
  @media (max-width: ${theme.breakpoints.mobile}) {
    html {
      font-size: 14px;
    }

    h1 {
      font-size: 36px;
    }

    h2 {
      font-size: 28px;
    }

    h3 {
      font-size: 20px;
    }
  }

  /* Erişilebilirlik */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  /* Karanlık mod */
  @media (prefers-color-scheme: dark) {
    body {
      color: ${theme.colors.primary.white};
      background-color: ${theme.colors.primary.black};
    }
  }
\`;
