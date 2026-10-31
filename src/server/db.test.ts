import assert from 'node:assert/strict';
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
});
