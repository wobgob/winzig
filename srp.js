import crypto from 'crypto'
import bigintBuffer from 'bigint-buffer'
import BigInteger from 'big-integer'

const N = BigInt('0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7')
const g = BigInt('0x7')
const hash = 'sha1'
const nbytes = 32

let calculateH2 = (username, password, salt) => {
    let h1 = crypto.createHash(hash)
        .update(username + ':' + password)
        .digest()
    let h2 = crypto.createHash(hash)
        .update(salt)
        .update(h1)
        .digest()
    return bigintBuffer.toBigIntLE(h2)
}

export let calculateVerifier = (username, password, salt) => {
    let h2 = calculateH2(username, password, salt)
    let verifier = BigInteger(g).modPow(h2, N)
    return Buffer.from(verifier.value.toString(16).match(/.{2}/g).reverse().join(''), 'hex')
}

export let makeRegistrationData = (username, password) => {
    let salt = crypto.randomBytes(nbytes)
    let verifier = calculateVerifier(username, password, salt)
    return [salt, verifier]
}