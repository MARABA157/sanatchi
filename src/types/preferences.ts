export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'tr' | 'en';
  aiStyle: {
    artStyle: string;
    colorPalette: string;
    complexity: 'simple' | 'moderate' | 'complex';
  };
  notifications: {
    email: boolean;
    browser: boolean;
  };
  displayMode: 'grid' | 'list';
  autoplay: boolean;
}