/**
 * THIS FILE IS FOR EXTRACTING ENV VARS AND DEFAULTING THEM OR TRANSFORMING THEM IF NEEDED
 */

type Environment = 'local' | 'staging' | 'prod';

export const determineReactEnv = () => {
  const proxyEnv = process.env.REACT_APP_REDOX_PROXY_ENV;
  const { hostname } = window.location;

  return proxyEnv
    ? 'local'
    : hostname.includes('10x')
    ? 'staging'
    : hostname.includes('redoxengine.systems')
    ? 'local'
    : 'prod';
};

const env = determineReactEnv();

const appConfigsByEnv: {
  [key in Environment]: {
    DASHBOARD_URL: string;
    API_KEY: string;
    API_SECRET: string;
  };
} = {
  local: {
    DASHBOARD_URL: 'http://localhost:3000',
    API_KEY: process.env.REACT_APP_REDOX_API_KEY || 'not-defined',
    API_SECRET: process.env.REACT_APP_REDOX_API_SECRET || 'not-defined',
  },
  staging: {
    DASHBOARD_URL: 'https://staging.mycoolapp.com',
    API_KEY: process.env.REACT_APP_REDOX_API_KEY || 'not-defined',
    API_SECRET: process.env.REACT_APP_REDOX_API_SECRET || 'not-defined',
  },
  prod: {
    DASHBOARD_URL: 'https://mycoolapp.com',
    API_KEY: process.env.REACT_APP_REDOX_API_KEY || 'not-defined',
    API_SECRET: process.env.REACT_APP_REDOX_API_SECRET || 'not-defined',
  },
};

export const appConfig = appConfigsByEnv[env];
