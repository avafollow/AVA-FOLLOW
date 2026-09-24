async function test() {
  const url = 'https://www.tiktok.com/@vtv24news/live'; 
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    }
  });
  const text = await response.text();
  const sigiMatch = text.match(/<script id="SIGI_STATE" type="application\/json">([\s\S]*?)<\/script>/);
  if (sigiMatch) {
      console.log('SIGI_STATE found');
  } else {
      const match2 = text.match(/window\.__UNIVERSAL_DATA_FOR_REHYDRATION__ = (.*?);<\/script>/) || text.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
      if (match2) {
         console.log('UNIVERSAL_DATA found');
         const data = JSON.parse(match2[1]);
         console.log(Object.keys(data));
      } else {
         console.log('Nothing found. Length:', text.length);
      }
  }
}
test();
