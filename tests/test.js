(function (sha256, sha224) {
  Array.prototype.toHexString = ArrayBuffer.prototype.toHexString = function () {
    var array = new Uint8Array(this);
    var hex = '';
    for (var i = 0; i < array.length; ++i) {
      var c = array[i].toString('16');
      hex += c.length === 1 ? '0' + c : c;
    }
    return hex;
  };

  var testCases = {
    sha256: {
      'UTF8': {
        'QR1iuMU0bBmND9mmRX5rQs3glx1NqdqsZaiV0foY7n4=': 'fe-ep-alert-recipients-select-all-enabled',
      },
    },
  };

  var errorTestCases = [null, undefined, { length: 0 }, 0, 1, false, true, NaN, Infinity, function () {}];


  var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  
  function _encodeBinary(input) {
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
        _keyStr.charAt(enc1) +
        _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) +
        _keyStr.charAt(enc4);
    }

    return output;
  }

  function encodeArrayBuffer(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return _encodeBinary(binary);
  }

  function runTestCases(name, algorithm) {
    var methods = [
      {
        name: name + '.arrayBuffer',
        call: function (message) {
          let buffer = sha256.create().update(message).arrayBuffer();
          return encodeArrayBuffer(buffer);
        }
      }
    ];

    var classMethods = [
    ];

    var subTestCases = testCases[name];

    describe(name, function () {
      methods.forEach(function (method) {
        describe('#' + method.name, function () {
          for (var testCaseName in subTestCases) {
            (function (testCaseName) {
              var testCase = subTestCases[testCaseName];
              context('when ' + testCaseName, function () {
                for (var hash in testCase) {
                  (function (message, hash) {
                    it('should be equal', function () {
                      expect(method.call(message)).to.be(hash);
                    });
                  })(testCase[hash], hash);
                }
              });
            })(testCaseName);
          }
        });
      });

      classMethods.forEach(function (method) {
        describe('#' + method.name, function () {
          for (var testCaseName in subTestCases) {
            (function (testCaseName) {
              var testCase = subTestCases[testCaseName];
              context('when ' + testCaseName, function () {
                for (var hash in testCase) {
                  (function (message, hash) {
                    it('should be equal', function () {
                      expect(method.call(message)).to.be(hash);
                    });
                  })(testCase[hash], hash);
                }
              });
            })(testCaseName);
          }
        });
      });

      describe('#' + name, function () {
        errorTestCases.forEach(function (testCase) {
          context('when ' + testCase, function () {
            it('should throw error', function () {
              expect(function () {
                algorithm(testCase);
              }).to.throwError(/input is invalid type/);
            });
          });
        });

        context('when large size', function () {
          var hash = algorithm.create();
          hash.bytes = 4294967295;
          hash.update('any');
          expect(hash.hBytes).to.be(1);
        });
      });
    });
  }

  runTestCases('sha256', sha256);
  runTestCases('sha224', sha224);
})(sha256, sha224);
