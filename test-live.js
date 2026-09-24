async function test() {
  const url = 'https://www.tiktok.com/@hapas.official/live';
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    }
  });
  const text = await response.text();
  const match = text.match(/<script id="SIGI_STATE" type="application\/json">([\s\S]*?)<\/script>/);
  if (match) {
    const state = JSON.parse(match[1]);
    console.log(Object.keys(state));
    if (state.LiveRoom) {
      console.log('LiveRoom found!');
      // Dump part of it
      console.log(JSON.stringify(state.LiveRoom).substring(0, 500));
    }
  } else {
    const match2 = text.match(/window\.__UNIVERSAL_DATA_FOR_REHYDRATION__ = (.*?);<\/script>/);
    if (match2) {
      console.log('Found UNIVERSAL_DATA_FOR_REHYDRATION');
      console.log(match2[1].substring(0, 500));
    } else {
      console.log('State not found');
    }
  }
}
test();
