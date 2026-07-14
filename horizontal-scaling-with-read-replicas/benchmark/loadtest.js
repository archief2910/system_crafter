const autocannon = require('autocannon');

const URL = 'http://localhost:3000/api/users'; // Hitting the read endpoint

async function runTest(title, duration, connections) {
  console.log(`\n--- Starting Benchmark: ${title} ---`);
  console.log(`Connections: ${connections}, Duration: ${duration}s`);
  
  const instance = autocannon({
    url: URL,
    connections: connections,
    duration: duration,
  });
  
  autocannon.track(instance, { renderProgressBar: true });
  
  return new Promise((resolve) => {
    instance.on('done', (result) => {
      console.log(`\nResults for ${title}:`);
      console.log(`Requests/sec: ${result.requests.average}`);
      console.log(`Latency (p99): ${result.latency.p99} ms`);
      console.log(`Errors: ${result.errors}`);
      resolve(result);
    });
  });
}

async function runAll() {
  console.log('Ensure the Node.js backend and Docker containers are running before starting this test.');
  // Give the server a second to warm up
  await new Promise(r => setTimeout(r, 1000));
  
  // Test 1: Light load
  await runTest('Light Load (10 connections)', 10, 10);
  
  // Test 2: Heavy load
  await runTest('Heavy Load (100 connections)', 10, 100);
}

runAll();
