import gefyra from '../gefyra';

test('Gefyra Status', () => {
  let output = gefyra();
  let expectation = JSON.parse('{"status": "success", "available": ["gefyra.status", "gefyra.up", "gefyra.down", "k8s.contexts", "k8s.namespaces", "k8s.workloads", "k8s.images"], "host": "thinkpad-x1", "user": "mschilonka", "response": {"status": "up"}}')
  expect(output).toMatchObject(expectation);
});