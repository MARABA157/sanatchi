const API_KEY = 'sk-cFmurbMnDUPjbUrugegD5GXey87g5CGdpmgP2iLRmxJqCLdD';

async function testAPI() {
  try {
    // 1. API erişimi kontrolü
    const balanceResponse = await fetch('https://api.stability.ai/v1/user/account', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Account Response:', await balanceResponse.json());

    // 2. Video API'sini test et
    const videoResponse = await fetch('https://api.stability.ai/v1/generation/stable-video-full', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: "A running horse in a field",
            weight: 1
          }
        ],
        height: 576,
        width: 1024,
        cfg_scale: 2.5,
        motion_bucket_id: 127,
        seed: Math.floor(Math.random() * 1000000)
      })
    });

    console.log('Video Response Status:', videoResponse.status);
    const responseText = await videoResponse.text();
    console.log('Video Response:', responseText);

  } catch (error) {
    console.error('Test Error:', error);
  }
}

testAPI();
