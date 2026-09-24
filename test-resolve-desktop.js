async function test() {
  const url = 'https://vt.tiktok.com/ZS23M7Wn5/'; 
  const response = await fetch(url, {
    redirect: 'manual',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  console.log('Status:', response.status);
  console.log('Location:', response.headers.get('location'));
}
test();
