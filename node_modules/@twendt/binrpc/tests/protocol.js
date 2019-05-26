var binrpc = require('./../lib/protocol.js');

require('should');

describe('binrpc.encodeRequest', function () {

    it("should return buffer", function () {
        var cmd = binrpc.encodeRequest('system.listMethods').toString('hex');
        cmd.should.equal('42 69 6e 00 00 00 00 1a 00 00 00 12 73 79 73 74 65 6d 2e 6c 69 73 74 4d 65 74 68 6f 64 73 00 00 00 00'.replace(/ /g, ''));
    });

    it("should return buffer", function () {
        var cmd = binrpc.encodeRequest('init', ['xmlrpc_bin://172.16.23.180:2004', 'test']).toString('hex');
        cmd.should.equal('42 69 6e 00 00 00 00 3f 00 00 00 04 69 6e 69 74 00 00 00 02 00 00 00 03 00 00 00 1f 78 6d 6c 72 70 63 5f 62 69 6e 3a 2f 2f 31 37 32 2e 31 36 2e 32 33 2e 31 38 30 3a 32 30 30 34 00 00 00 03 00 00 00 04 74 65 73 74'.replace(/ /g, ''));
    });

});

describe('binrpc.decodeRequest', function () {
    it("should return object", function () {
        var obj = binrpc.decodeRequest(binrpc.encodeRequest('test', [{"bla": "blubb"}]));
        obj.should.have.properties({
            method: 'test',
            params: [{bla: 'blubb'}]
        });
    });
});

describe('binrpc.decodeRequest', function () {
    it("should return object", function () {
        var obj = binrpc.decodeRequest(binrpc.encodeRequest('init', ['xmlrpc_bin://172.16.23.180:2004', 'test']));
        obj.should.have.properties({
            method: 'init',
            params: ['xmlrpc_bin://172.16.23.180:2004', 'test']
        });
    });
});

describe('binrpc.decodeRequest', function () {
    it("should return object", function () {
        var obj = binrpc.decodeRequest(binrpc.encodeRequest('system.multicall', [[{methodName: 'event', params: ['ID', 'LEVEL', 1]}, {methodName: 'event', params: ['ID', 'STATE', true]}]]));
        obj.should.have.properties({
            method: 'system.multicall',
            params: [[{methodName: 'event', params: ['ID', 'LEVEL', 1]}, {methodName: 'event', params: ['ID', 'STATE', true]}]]
        });
    });
});

describe('binrpc.decodeRequest', function () {
    it("should return object", function () {
        var obj = binrpc.decodeRequest(binrpc.encodeRequest('setValue', ['EEQ123456:1', 'STATE', true]));
        obj.should.have.properties({
            method: 'setValue',
            params: ['EEQ123456:1', 'STATE', true]
        });
    });
});


describe('binrpc.encodeInteger', function () {
    it("should return buffer", function () {
        var buf = binrpc.encodeInteger(41);
        var hexstring = buf.toString('hex');
        (buf instanceof Buffer).should.be.true;
        hexstring.should.equal('00 00 00 01 00 00 00 29'.replace(/ /g, ''));
    });
});

describe('binrpc.encodeBool', function () {
    it("should return buffer", function () {
        var buf = binrpc.encodeBool(true);
        var hexstring = buf.toString('hex');
        (buf instanceof Buffer).should.equal(true);
        hexstring.should.equal('00 00 00 02 01'.replace(/ /g, ''));
    });
});

describe('binrpc.encodeString', function () {
    it("should return buffer", function () {
        var buf = binrpc.encodeString('BidCoS-RF');
        var hexstring = buf.toString('hex');
        (buf instanceof Buffer).should.equal(true);
        hexstring.should.equal('00 00 00 03 00 00 00 09 42 69 64 43 6f 53 2d 52 46'.replace(/ /g, ''));
    });
});

describe('binrpc.encodeData', function () {
    it("explicitDouble should return buffer", function () {
        var buf = binrpc.encodeData({explicitDouble: 1234});
        var hexstring = buf.toString('hex');
        (buf instanceof Buffer).should.equal(true);
        hexstring.should.equal('00 00 00 04 26 90 00 00 00 00 00 0b'.replace(/ /g, ''));
    });
    it('should throw an error if elem is undefined', function () {
        (function () {
            binrpc.encodeData();
        }).should.throw();
    });
});

describe('binrpc.encodeString', function () {
    it('should throw an error if elem is not a string', function () {
        (function () {
            binrpc.encodeString(123);
        }).should.throw();
    });
});


describe('binrpc.decodeStrangeRequest', function () {
    it('should throw an error if elem is not instanceof Buffer', function () {
        (function () {
            binrpc.decodeStrangeRequest('string');
        }).should.throw();
    });
});

describe('binrpc.decodeRequest', function () {
    it('should throw an error if elem is not instanceof Buffer', function () {
        (function () {
            binrpc.decodeRequest('string');
        }).should.throw();
    });
    it('should return false if Buffer doesn\'t start with Bin', function () {
        binrpc.decodeRequest(Buffer.from('abc')).should.equal.false;
    });
});

describe('binrpc.encodeDouble', function () {
    it("should return buffer", function () {
        var buf = binrpc.encodeDouble(1234);
        var hexstring = buf.toString('hex');
        (buf instanceof Buffer).should.equal(true);
        hexstring.should.equal('00 00 00 04 26 90 00 00 00 00 00 0b'.replace(/ /g, ''));
    });

    it("should return buffer", function () {
        var buf = binrpc.encodeDouble(-9999.9999);
        var hexstring = buf.toString('hex');
        (buf instanceof Buffer).should.equal(true);
        hexstring.should.equal('00 00 00 04 d8 f0 00 06 00 00 00 0e'.replace(/ /g, ''));
    });
    it('should throw an error if elem is not a number', function () {
        (function () {
            binrpc.encodeDouble('abc');
        }).should.throw();
    });
});

describe('binrpc.encodeStruct', function () {
    it("should return buffer", function () {
        var buf = binrpc.encodeStruct({'Temperature': 20.5});
        var hexstring = buf.toString('hex');
        (buf instanceof Buffer).should.equal(true);
        hexstring.should.equal('00 00 01 01 00 00 00 01 00 00 00 0b 54 65 6d 70 65 72 61 74 75 72 65 00 00 00 04 29 00 00 00 00 00 00 05'.replace(/ /g, ''));
    });
});

describe('binrpc.decodeData(binrpc.encodeDouble(x))', function () {
    it("rest should be zero length buffer", function () {
        var buf = binrpc.decodeData(binrpc.encodeDouble(1234)).rest;
        (buf instanceof Buffer).should.equal(true);
        buf.length.should.equal(0);
    });
});

describe('binrpc.decodeData(binrpc.buildDouble(x))', function () {

    var values = [0, 0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, -0.5, -20.5, 20.5, 100, 1234, 50.123456, -50.123456, 0.999999, -1, -0.000001];

    for (var i = 0; i < values.length; i++) {
        createTest(values[i]);
    }

    function createTest(_val) {
        return it('content should return ' + _val, function () {
            var buf = binrpc.encodeDouble(_val);
            binrpc.decodeData(buf).content.should.equal(_val);
        });
    }

});

describe('binrpc.decodeData(binrpc.encodeInteger(x))', function () {

    var values = [-2147483648, -1000, -100, -10, -1, 0, 1, 2, 3, 4, 5, 10, 100, 1000, 65535, 2147483647];

    for (var i = 0; i < values.length; i++) {
        createTest(values[i]);
    }

    function createTest(_val) {
        return it('content should return ' + _val, function () {
            var buf = binrpc.encodeInteger(_val);
            binrpc.decodeData(buf).content.should.equal(_val);
        });
    }

});

describe('binrpc.decodeData(binrpc.encodeBool(x))', function () {

    var values = [false, true];

    for (var i = 0; i < values.length; i++) {
        createTest(values[i]);
    }

    function createTest(_val) {
        return it('content should return ' + _val, function () {
            var buf = binrpc.encodeBool(_val);
            binrpc.decodeData(buf).content.should.equal(_val);
        });
    }

});

describe('binrpc.decodeString(elem)', function () {
    it('should throw an error if elem is not an instance of Buffer', function () {
        (function () {
            binrpc.decodeString('string');
        }).should.throw();
    });
    it('should throw an error if elem length is < 4', function () {
        (function () {
            binrpc.decodeString(Buffer.from('123'));
        }).should.throw();
    });
});

describe('binrpc.decodeInteger(elem)', function () {
    it('should throw an error if elem is not an instance of Buffer', function () {
        (function () {
            binrpc.decodeInteger('string');
        }).should.throw();
    });
    it('should throw an error if elem length is < 4', function () {
        (function () {
            binrpc.decodeInteger(Buffer.from('123'));
        }).should.throw();
    });
});

describe('binrpc.decodeStruct(elem)', function () {
    it('should throw an error if elem is not an instance of Buffer', function () {
        (function () {
            binrpc.decodeStruct('string');
        }).should.throw();
    });
    it('should throw an error if elem length is < 4', function () {
        (function () {
            binrpc.decodeStruct(Buffer.from('123'));
        }).should.throw();
    });
});


describe('binrpc.decodeData(elem)', function () {
    it('should throw an error if elem is not an instance of Buffer', function () {
        (function () {
            binrpc.decodeData('string');
        }).should.throw();
    });
    it('should return undefined if Buffer is empty', function () {
        var res = binrpc.decodeData(Buffer.from([]));
        (typeof res).should.equal('undefined');
    });
});

describe('binrpc.decodeResponse(elem)', function () {
    it('should throw an error if elem is not an instance of Buffer', function () {
        (function () {
            binrpc.decodeResponse('string');
        }).should.throw();
    });
    it('should return false if Buffer doesn\'t start with Bin', function () {
        binrpc.decodeResponse(Buffer.from('abc')).should.equal.false;
    });
});


describe('binrpc.decodeArray(elem)', function () {
    it('should throw an error if elem is not an instance of Buffer', function () {
        (function () {
            binrpc.decodeArray('string');
        }).should.throw();
    });
    it('should throw an error if elem length is < 4', function () {
        (function () {
            binrpc.decodeArray(Buffer.from('123'));
        }).should.throw();
    });
});

describe('binrpc.encodeArray(elem)', function () {
    it('should throw an error if elem is not an instance of Array', function () {
        (function () {
            binrpc.encodeArray('string');
        }).should.throw();
    });
});

/* TODO
describe('binrpc.decodeArray(elem)', function () {
    it('should decode a length 0 array', function () {
        binrpc.decodeArray(binrpc.encodeArray([])).length.should.equal(0);
    });
});
*/


describe('binrpc.decodeBool(elem)', function () {
    it('should throw an error if elem is not an instance of Buffer', function () {
        (function () {
            binrpc.decodeBool('string');
        }).should.throw();
    });
    it('should throw an error if elem length is < 1', function () {
        (function () {
            binrpc.decodeBool(Buffer.alloc(0));
        }).should.throw();
    });
});


describe('binrpc.decodeDouble(elem)', function () {
    it('should throw an error if elem is not an instance of Buffer', function () {
        (function () {
            binrpc.decodeDouble('string');
        }).should.throw();
    });

    it('should throw an error if elem is not an instance of Buffer', function () {
        (function () {
            binrpc.decodeDouble({test: true});
        }).should.throw();
    });

    it('should throw an error if elem is not an instance of Buffer', function () {
        (function () {
            binrpc.decodeDouble(false);
        }).should.throw();
    });

    it('should throw an error if elem is not an instance of Buffer', function () {
        (function () {
            binrpc.decodeDouble([0]);
        }).should.throw();
    });

    it('should throw an error if elem length is < 8', function () {
        (function () {
            binrpc.decodeDouble(Buffer.from('1234567'));
        }).should.throw();
    });
});

describe('binrpc.encodeInteger', function () {
    it("should throw an error if out of range", function () {
        (function () {
            binrpc.encodeInteger(-2147483649);
        }).should.throw();
    });
    it("should throw an error if out of range", function () {
        (function () {
            binrpc.encodeInteger(2147483648);
        }).should.throw();
    });
    it("should throw an error if argument is not type number", function () {
        (function () {
            binrpc.encodeInteger('string');
        }).should.throw();
    });
    it("should throw an error if argument is not type number", function () {
        (function () {
            binrpc.encodeInteger(false);
        }).should.throw();
    });
});

describe('binrpc.encodeRequest', function () {
    it("should throw an error if argument is not type string", function () {
        (function () {
            binrpc.encodeRequest(false);
        }).should.throw();
    });
    it("should throw an error if argument is an empty string", function () {
        (function () {
            binrpc.encodeRequest('');
        }).should.throw();
    });
});

describe('binrpc.encodeResponse', function () {
    it("should encode an empty string on undefined param", function () {
        var hexstring = binrpc.encodeResponse().toString('hex');
        hexstring.should.equal('42 69 6e 01 00 00 00 08 00 00 00 03 00 00 00 00'.replace(/ /g, ''));
    });
});

describe('binrpc.encodeStruct', function () {
    it("should throw an error if argument is not type object", function () {
        (function () {
            binrpc.encodeStruct(false);
        }).should.throw();
    });
    it("should not throw an error if object is empty", function () {
        binrpc.encodeStruct({});
    });
});

describe('binrpc.encodeStructKey', function () {
    it("should throw an error if argument is not type string", function () {
        (function () {
            binrpc.encodeStructKey(false);
        }).should.throw();
    });
});