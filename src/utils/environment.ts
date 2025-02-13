interface Environment {
  production: boolean;
  development: boolean;
  test: boolean;
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  antropicApiKey: string;
  mistralaiApiKey: string;
  imagepigApiKey: string;
  imageartApiKey: string;
  json2videoApiKey: string;
  shotstackApiKey: string;
}

export const environment: Environment = {
  production: import.meta.env.MODE === 'production',
  development: import.meta.env.MODE === 'development',
  test: import.meta.env.MODE === 'test',
  apiUrl: import.meta.env.VITE_API_URL || '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  antropicApiKey: import.meta.env.VITE_ANTROPIC_API_KEY || '',
  mistralaiApiKey: import.meta.env.VITE_MISTRALAI_API_KEY || '',
  imagepigApiKey: import.meta.env.VITE_IMAGEPIG_API_KEY || '',
  imageartApiKey: import.meta.env.VITE_IMAGEART_API_KEY || '',
  json2videoApiKey: import.meta.env.VITE_JSON2VIDEO_API_KEY || '',
  shotstackApiKey: import.meta.env.VITE_SHOTSTACK_API_KEY || '',
};
