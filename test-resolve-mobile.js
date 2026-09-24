async function test() {
  const url = 'https://www.tiktok.com/@vtv24news/live'; 
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    }
  });
  const text = await response.text();
  const idx = text.indexOf('m3u8');
  if (idx > -1) {
     console.log('m3u8 found around:', text.substring(idx - 100, idx + 100));
  } else {
     console.log('m3u8 not found!');
  }
}
test();
