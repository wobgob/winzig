import assert from 'assert';
import { calculateVerifier } from '../srp.js';

describe('calculateVerifier', function() {
    it('should return a verifier given a username, password, and salt', function() {
        const salt = Buffer.from('BD3A498CAD22DDDFAA7CB1AFD24669BB7C2DD439B141A15044F8C984E9C96017', 'hex');
        const verifier = Buffer.from('1FA37648ADFBB867A0A2C618E41090AF77CAB7C7DEF77EF56429FDDA7F311B7B', 'hex');
        assert.deepEqual(calculateVerifier('foo', 'bar', salt), verifier);
    })
})