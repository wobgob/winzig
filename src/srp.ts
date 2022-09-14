import crypto from "crypto"
import * as BigIntModArith from "bigint-mod-arith"

const N = BigInt('0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7')
const g = BigInt('0x7')
const hash = 'sha1'
const nbytes = 32

const calculateH2 = (username: string, password: string, salt: Buffer): bigint => {
    const h1 = crypto.createHash(hash)
        .update(username + ":" + password)
        .digest()
    const h2 = crypto.createHash(hash)
        .update(salt)
        .update(h1)
        .digest()
    const str = h2.toString("hex").match(/.{2}/g)?.reverse().join('')
    return BigInt(`0x${str}`)
}

export const calculateVerifier = (username: string, password: string, salt: Buffer): Buffer => {
    const h2 = calculateH2(username, password, salt)
    const verifier = BigIntModArith.modPow(g, h2, N).toString(16).match(/.{2}/g)

    if (verifier)
        return Buffer.from(verifier.reverse().join(''), "hex")

    throw new Error(`Did not match for ${username}:${password}`)
}

export const makeRegistrationData = (username: string, password: string) => {
    const salt = crypto.randomBytes(nbytes)
    const verifier = calculateVerifier(username, password, salt)
    return [salt, verifier]
}