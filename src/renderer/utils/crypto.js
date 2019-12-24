import {createHash} from 'crypto'

/**
 * @param {string} algorithm
 * @param {any} content
 *  @return {string}
 */
export const encrypt = (algorithm, content) => {
    let hash = createHash(algorithm)
    hash.update(content)
    return hash.digest('hex')
}

/**
 * @param {any} content
 *  @return {string}
 */
export const sha1 = (content) => encrypt('sha1', content)

/**
 * @param {any} content
 *  @return {string}
 */
export const md5 = (content) => encrypt('md5', content)

/**
 * @param {any} content
 *  @return {string}
 */
export const HmacSHA1 = (str, key) => createHash.HmacSHA1(str, key).toString();

/**
 * @param {any} content
 *  @return {string}
 */
export const hmacMD5 = (data,key) =>{
    let hmac = createHash.createHmac('md5',key);
    return hmac.update(data).digest('base64');
}
 
export default encrypt