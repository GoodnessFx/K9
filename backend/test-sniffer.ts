import { SourceSniffer } from './src/sniffer/SourceSniffer.js';
import logger from './src/utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

async function testSniffer() {
  const sniffer = new SourceSniffer();
  const testUrl = 'https://remoteok.com/remote-web3-jobs';

  console.log(`\n--- Starting Stealth Sniffer Test ---`);
  console.log(`Target: ${testUrl}`);
  
  try {
    const result = await sniffer.sniff(testUrl);
    
    if (result) {
      console.log('\n✅ Sniff Successful!');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('\n❌ Sniff Failed (Check logs for details)');
    }
  } catch (error) {
    console.error('\n❌ Test execution error:', error);
  }
}

testSniffer();
