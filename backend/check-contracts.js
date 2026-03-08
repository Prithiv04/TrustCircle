const https = require('https');

const CONTRACTS = [
    '0x842b580EdA9e4930b4f09B05cB39f92a5cD9fF26',
    '0x8f1Ff851afa75D98753c8aB4352b37D07797f408',
    '0x68409ee9d9D9b7DfdEb4b2dd2bddb7f1312cB947',
    '0x6Cee7aA2E56053e2656a20097eAECbd9AD786E17'
];

async function checkCode(address) {
    const data = JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [address, 'latest'],
        id: 1
    });

    const options = {
        hostname: 'rpc.cc3-testnet.creditcoin.network',
        port: 443,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => resolve(JSON.parse(body)));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

(async () => {
    for (const addr of CONTRACTS) {
        const res = await checkCode(addr);
        console.log(`Address ${addr}: code length ${res.result.length}`);
    }
})();
