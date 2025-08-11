const fs = require('fs');
const path = require('path');
const axios = require('axios');

const PAYLOADS_DIR = path.join(__dirname, 'payloads');
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/webhook';
const LOOP_FOREVER = false;

function loadPayloads() {
  const files = fs.readdirSync(PAYLOADS_DIR).filter(f => f.endsWith('.json'));
  const payloads = files.map(file => {
    const filePath = path.join(PAYLOADS_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let ts = null;
    if (data.createdAt) {
      ts = new Date(data.createdAt).getTime();
    } else {
      const msgTs = data?.metaData?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.timestamp ||
                    data?.metaData?.entry?.[0]?.changes?.[0]?.value?.statuses?.[0]?.timestamp;
      if (msgTs) ts = parseInt(msgTs) * 1000;
    }
    return { file, data, ts: ts || Date.now() };
  });
  return payloads.sort((a, b) => a.ts - b.ts);
}

async function sendPayload(payload) {
  try {
    const res = await axios.post(BACKEND_URL, payload.data, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`✅ Sent ${payload.file} (${new Date(payload.ts).toISOString()})`);
  } catch (err) {
    console.error(`❌ Error sending ${payload.file}:`, err.message);
  }
}

async function replayOnce(payloads) {
  for (const payload of payloads) {
    await sendPayload(payload);
    await new Promise(r => setTimeout(r, 1000));
  }
}

async function main() {
  do {
    const payloads = loadPayloads();
    console.log(`📦 Loaded ${payloads.length} payload(s)`);
    await replayOnce(payloads);
    if (LOOP_FOREVER) {
      console.log('🔄 Looping again in 5s...');
      await new Promise(r => setTimeout(r, 5000));
    }
  } while (LOOP_FOREVER);
  console.log('🎉 Replay finished');
}

main();