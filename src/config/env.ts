interface Config {
    apiBaseUrl: string;
  }
  
  const development: Config = {
    apiBaseUrl: 'http://localhost:8000/api',
  };
  
  const production: Config = {
    apiBaseUrl: 'https://babyaccounts.onrender.com/api',
  };
  
  export const config = process.env.NODE_ENV === 'production' ? production : development;