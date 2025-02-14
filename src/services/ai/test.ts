const API_KEY = 'sk-cFmurbMnDUPjbUrugegD5GXey87g5CGdpmgP2iLRmxJqCLdD';

async function testAPI() {
  try {
    // 1. Önce balance kontrolü
    const balanceResponse = await fetch('https://api.stability.ai/v1/user/balance', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      }
    });
    console.log('Balance Response:', await balanceResponse.json());

    // 2. Engines listesi
    const enginesResponse = await fetch('https://api.stability.ai/v1/engines/list', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      }
    });
    console.log('Engines Response:', await enginesResponse.json());

    // 3. Video generation test
    const videoResponse = await fetch('https://api.stability.ai/v1/generation/stable-video', {
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
        motion_bucket_id: 127
      })
    });

    console.log('Video Response Status:', videoResponse.status);
    console.log('Video Response:', await videoResponse.text());

  } catch (error) {
    console.error('Test Error:', error);
  }
}

testAPI();
