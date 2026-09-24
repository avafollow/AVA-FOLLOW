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
    const liveRoom = state.LiveRoom?.liveRoomUserInfo?.liveRoom;
    if (liveRoom) {
      console.log('UserCount:', liveRoom.liveRoomStats?.userCount);
      console.log('StreamData:', liveRoom.streamData?.pull_data?.stream_data);
    }
  }
}
test();
