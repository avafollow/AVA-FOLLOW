import handler from './api/tiktok-resolve.js';

const req = {
  method: 'GET',
  query: { url: 'https://www.tiktok.com/@vtv24news/live' }
};

const res = {
  setHeader: () => {},
  status: (code) => {
    return {
      json: (data) => console.log('JSON:', code, data),
      end: () => console.log('End:', code)
    };
  }
};

handler(req, res);
