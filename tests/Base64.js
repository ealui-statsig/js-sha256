// Encoding logic from https://stackoverflow.com/a/246813/1524355, with slight modifications to make it work for binary strings
export const Base64 = {
    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  
    _encodeBinary: function (input: string): string {
      let output = '';
      let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      let i = 0;
  
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
  
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
  
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
  
        output =
          output +
          this._keyStr.charAt(enc1) +
          this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) +
          this._keyStr.charAt(enc4);
      }
  
      return output;
    },
  
    encodeArrayBuffer(buffer: ArrayBuffer): string {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return Base64._encodeBinary(binary);
    },
  };
