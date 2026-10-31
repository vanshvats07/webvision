import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { describe, it } from 'node:test';
import { generateToken, hashPassword, parseToken, verifyPassword } from './db.js';

describe('password utilities', () => {
  it('hashes passwords with a unique salted scrypt hash', () => {
    const firstHash = hashPassword('test-password');
    const secondHash = hashPassword('test-password');

    assert.match(firstHash, /^scrypt\$[a-f0-9]+\$[a-f0-9]+$/);
    assert.notEqual(firstHash, secondHash);
    assert.equal(verifyPassword('test-password', firstHash), true);
  });

  it('rejects an incorrect password', () => {
    assert.equal(verifyPassword('wrong-password', hashPassword('test-password')), false);
  });

  it('continues to verify legacy password hashes for migration', () => {
    const legacyHash = createHash('sha256')
      .update('mait_salt_2026_test-password')
      .digest('hex');

    assert.equal(verifyPassword('test-password', legacyHash), true);
  });

  it('rejects malformed stored hashes without authenticating', () => {
    assert.equal(verifyPassword('test-password', 'scrypt$missing'), false);
    assert.equal(verifyPassword('test-password', 'not-a-hash'), false);
  });
});

describe('authentication tokens', () => {
  it('round-trips the user ID in a signed token', () => {
    const token = generateToken('usr-test');

    assert.equal(parseToken(token), 'usr-test');
  });

  it('rejects a token with a modified signature', () => {
    const [payload, signature] = generateToken('usr-test').split('.');
    const replacement = signature[0] === 'a' ? 'b' : 'a';

    assert.equal(parseToken(`${payload}.${replacement}${signature.slice(1)}`), null);
  });

  it('rejects malformed tokens with missing or extra segments', () => {
    const token = generateToken('usr-test');

    assert.equal(parseToken(''), null);
    assert.equal(parseToken('payload'), null);
    assert.equal(parseToken(`${token}.unexpected`), null);
  });

  it('rejects tokens after their 12-hour lifetime', (testContext) => {
    const token = generateToken('usr-test');
    const now = Date.now();
    testContext.mock.method(Date, 'now', () => now + 13 * 60 * 60 * 1000);

    assert.equal(parseToken(token), null);
  });

  it('rejects tokens issued in the future', (testContext) => {
    const now = Date.now();
    testContext.mock.method(Date, 'now', () => now + 60_000);
    const token = generateToken('usr-test');
    testContext.mock.restoreAll();

    assert.equal(parseToken(token), null);
  });
});
