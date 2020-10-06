import { v4 as uuidv4 } from 'uuid';

/**
 * 返回一个32位的UUID
 */
export function getUUID() {
    return uuidv4().replace(/[-]/g, '');
}
