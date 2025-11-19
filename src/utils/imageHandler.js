/**
 * Utilidades para manejar imágenes en base64
 */

/**
 * Valida si una cadena es base64 válida
 * @param {string} str - String a validar
 * @returns {boolean}
 */
const isValidBase64 = (str) => {
  if (!str || typeof str !== 'string') return false;
  
  // Permitir data URI completo
  const dataUriRegex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
  if (dataUriRegex.test(str)) {
    return true;
  }
  
  // Validar base64 puro
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  return base64Regex.test(str);
};

/**
 * Codifica una imagen para almacenamiento
 * Recibe base64 (con o sin data URI) y devuelve solo el base64 puro para guardar
 * @param {string} imageData - Imagen en base64
 * @returns {string} Base64 puro sin prefijos
 */
const encodeImageForStorage = (imageData) => {
  if (!imageData) return null;
  
  // Si tiene data URI prefix, extraer solo el base64
  const dataUriRegex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,(.+)$/;
  const match = imageData.match(dataUriRegex);
  
  if (match) {
    return match[2]; // Retorna solo el base64 puro
  }
  
  // Si ya es base64 puro, retornarlo tal cual
  return imageData;
};

/**
 * Decodifica una imagen para respuesta
 * Recibe base64 puro y devuelve con data URI prefix para uso en frontend
 * @param {string} imageData - Base64 puro desde BD
 * @param {string} mimeType - Tipo MIME (default: image/jpeg)
 * @returns {string} Data URI completo
 */
const decodeImageForResponse = (imageData, mimeType = 'image/jpeg') => {
  if (!imageData) return null;
  
  // Si ya tiene data URI prefix, retornarlo tal cual
  if (imageData.startsWith('data:image/')) {
    return imageData;
  }
  
  // Agregar data URI prefix
  return `data:${mimeType};base64,${imageData}`;
};

/**
 * Detecta el tipo MIME de una imagen base64
 * @param {string} imageData - Imagen en base64
 * @returns {string} Tipo MIME
 */
const detectImageMimeType = (imageData) => {
  if (!imageData) return 'image/jpeg';
  
  // Intentar extraer del data URI
  const dataUriRegex = /^data:(image\/(?:png|jpeg|jpg|gif|webp));base64,/;
  const match = imageData.match(dataUriRegex);
  
  if (match) {
    return match[1];
  }
  
  // Si es base64 puro, intentar detectar por los primeros bytes
  try {
    const buffer = Buffer.from(imageData.substring(0, 20), 'base64');
    const signature = buffer.toString('hex').toUpperCase();
    
    if (signature.startsWith('89504E47')) return 'image/png';
    if (signature.startsWith('FFD8FF')) return 'image/jpeg';
    if (signature.startsWith('47494638')) return 'image/gif';
    if (signature.startsWith('52494646') && signature.includes('57454250')) return 'image/webp';
  } catch (error) {
    // Si falla la detección, usar jpeg por defecto
  }
  
  return 'image/jpeg';
};

/**
 * Valida el tamaño de una imagen base64 (en MB)
 * @param {string} imageData - Imagen en base64
 * @param {number} maxSizeMB - Tamaño máximo en MB
 * @returns {boolean}
 */
const validateImageSize = (imageData, maxSizeMB = 5) => {
  if (!imageData) return true;
  
  // Extraer base64 puro si tiene data URI
  const base64Pure = encodeImageForStorage(imageData);
  
  // Calcular tamaño en bytes (base64 usa ~4/3 del tamaño original)
  const sizeInBytes = (base64Pure.length * 3) / 4;
  const sizeInMB = sizeInBytes / (1024 * 1024);
  
  return sizeInMB <= maxSizeMB;
};

module.exports = {
  isValidBase64,
  encodeImageForStorage,
  decodeImageForResponse,
  detectImageMimeType,
  validateImageSize
};

