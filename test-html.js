async function test() {
  const url = 'https://www.tiktok.com/@thaothanhtrang/live'; 
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const text = await response.text();
  const sigiMatch = text.match(/<script id="SIGI_STATE" type="application\/json">([\s\S]*?)<\/script>/);
  if (sigiMatch) {
     const state = JSON.parse(sigiMatch[1]);
     console.log('CurrentRoom:', state.CurrentRoom);
  }
}
test();
