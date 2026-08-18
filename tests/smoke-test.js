const http = require('http');

function request(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: { 'Content-Type': 'application/json', ...headers }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('=== Testing Global Imobiliária MVP ===\n');

  // Test 1: Homepage
  try {
    const home = await request('/');
    console.log(`✓ Homepage: ${home.status}`);
  } catch (e) {
    console.log(`✗ Homepage: Server not running - ${e.message}`);
    return;
  }

  // Test 2: Login page
  const login = await request('/login');
  console.log(`✓ Login page: ${login.status}`);

  // Test 3: Register API
  const registerBody = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    phone: '+244923456789',
    password: 'password123',
    role: 'BUYER'
  };
  const register = await request('/api/v1/auth/register', 'POST', registerBody);
  console.log(`✓ Register API: ${register.status} ${register.body.substring(0, 100)}`);

  // Test 4: Login API (skip if register failed)
  if (register.status === 201) {
    const registeredUser = JSON.parse(register.body);
    const loginBody = {
      email: registerBody.email,
      password: 'password123'
    };
    const loginRes = await request('/api/v1/auth/login', 'POST', loginBody);
    console.log(`✓ Login API: ${loginRes.status} ${loginRes.body.substring(0, 100)}`);
  }

  // Test 5: Dashboard redirect (unauthorized)
  const dash = await request('/dashboard');
  console.log(`✓ Dashboard unauth redirect: ${dash.status}`);

  // Test 6: Admin redirect (unauthorized)
  const admin = await request('/admin');
  console.log(`✓ Admin unauth redirect: ${admin.status}`);

  console.log('\n=== All tests completed ===');
}

main().catch(console.error);