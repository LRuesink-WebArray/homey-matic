/* eslint capitalized-comments: 0 */

var put = require('put');
var binary = require('binary');

/**
 * @class Protocol
 */
/** @exports protocol */
var Protocol = {

    /**
     * encode requests
     * @param {string} method - throws error if not type string or if string is empty
     * @param {*} data optional - defaults to an empty array
     * @returns {Buffer}
     */
    encodeRequest: function (method, data) {
        if (typeof method !== 'string') {
            throw new TypeError('argument \'method\' must be type string');
        }
        if (method === '') {
            throw new Error('argument \'method\' is not allowed to be empty');
        }
        if (typeof data === 'undefined') {
            data = [];
        }
        var content = Buffer.alloc(0);
        for (var i = 0; i < data.length; i++) {
            content = Buffer.concat([content, this.encodeData(data[i])]);
        }
        var header = put()
            .put(Buffer.from('Bin', 'ascii'))
            .word8(0)
            .word32be(8 + method.length + content.length) // Msg Size
            .word32be(method.length)
            .put(Buffer.from(method, 'ascii'))
            .word32be(data.length)
            .buffer();
        return Buffer.concat([header, content]);
    },

    /**
     * encode response
     * @param {*} data optional - defaults to empty string
     * @returns {Buffer}
     */
    encodeResponse: function (data) {
        if (typeof data === 'undefined') {
            data = '';
        }
        var body = this.encodeData(data);
        var buf = put()
            .put(Buffer.from('Bin', 'ascii'))
            .word8(0x01)
            .word32be(body.length)
            .buffer();
        return Buffer.concat([buf, body]);
    },
    /**
     * encode data
     * @param {*} obj throws TypeError if obj is undefined or null
     * @returns {Buffer}
     */
    encodeData: function (obj) {
        var buf;
        var objType = typeof obj;
        if (objType === 'undefined' || obj === null) {
            throw new TypeError('argument \'obj\' must be type number, string, boolean or object');
        }
        switch (objType) {
            case 'number':
                if (obj % 1 === 0) {
                    buf = this.encodeInteger(obj);
                } else {
                    buf = this.encodeDouble(obj);
                }
                break;

            case 'string':
                buf = this.encodeString(obj);
                break;

            case 'boolean':
                buf = this.encodeBool(obj);
                break;

            case 'object':
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    buf = this.encodeArray(obj);
                } else if (typeof obj.explicitDouble === 'number') {
                    buf = this.encodeDouble(obj.explicitDouble);
                } else {
                    buf = this.encodeStruct(obj);
                }
                break;
            default:
            // console.log('error');
        }
        return buf;
    },
    /**
     * encode struct
     * @param {object} obj throws error if not of type object
     * @returns {Buffer}
     */
    encodeStruct: function (obj) {
        if (typeof obj !== 'object') {
            throw new TypeError('argument \'d\' must be an object');
        }
        var i = 0;
        var content = Buffer.alloc(0);
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                content = Buffer.concat([content, this.encodeStructKey(key), this.encodeData(obj[key])]);
                i += 1;
            }
        }
        var header = put()
            .word32be(0x101)
            .word32be(i)
            .buffer();
        return Buffer.concat([header, content]);
    },
    /**
     * encode struct key
     * @param {string} str throws error if not of type string
     * @returns {Buffer}
     */
    encodeStructKey: function (str) {
        if (typeof str !== 'string') {
            throw new TypeError('argument \'d\' must be a string');
        }
        return put()
            .word32be(str.length)
            .put(Buffer.from(str, 'ascii'))
            .buffer();
    },
    /**
     * encode array
     * @param {array} arr throws error if not instance of Array
     * @returns {Buffer}
     */
    encodeArray: function (arr) {
        if (Object.prototype.toString.call(arr) !== '[object Array]') {
            throw new TypeError('argument \'d\' must be an array');
        }
        var buf;
        var arrLength = arr.length;

        buf = put()
            .word32be(0x100)
            .word32be(arrLength)
            .buffer();
        for (var i = 0; i < arrLength; i++) {
            buf = Buffer.concat([buf, this.encodeData(arr[i])]);
        }
        return buf;
    },
    /**
     * encode string
     * @param {string} str throws error if not of type string
     * @returns {Buffer}
     */
    encodeString: function (str) {
        if (typeof str !== 'string') {
            throw new TypeError('argument \'str\' must be a string');
        }
        return put()
            .word32be(0x0003)
            .word32be(str.length)
            .put(Buffer.from(str, 'ascii'))
            .buffer();
    },
    /**
     * encode bool
     * @param {*} b any type
     * @returns {Buffer}
     */
    encodeBool: function (b) {
        return put()
            .word32be(0x02)
            .word8be(b ? 1 : 0)
            .buffer();
    },
    /**
     * encode integer
     * @param {number} i throws error if not a number or if out of range (min=-2147483648 max=2147483647)
     * @returns {Buffer}
     */
    encodeInteger: function (i) {
        if (typeof i !== 'number') {
            throw new TypeError('argument \'i\' must be a number');
        }
        if (i < -2147483648 || i > 2147483647) {
            throw new RangeError('argument \'i\' must be between -2147483648 and 2147483647');
        }
        return put()
            .word32be(0x01)
            .word32be(i)
            .buffer();
    },
    /**
     * encode double
     * @param {number} d throws error if not a number
     * @returns {Buffer}
     */
    encodeDouble: function (d) {
        if (typeof d !== 'number') {
            throw new TypeError('argument \'d\' must be a number');
        }
        var exp = Math.floor(Math.log(Math.abs(d)) / Math.LN2) + 1;
        var man = Math.floor((d * Math.pow(2, -exp)) * (1 << 30));
        return put()
            .word32be(0x04)
            .word32be(man)
            .word32be(exp)
            .buffer();
    },
    /**
     * decode double
     * @param {Buffer} elem throws error if not an instance of Buffer or if length <8
     * @returns {object} properties content and rest
     */
    decodeDouble: function (elem) {
        if (!(elem instanceof Buffer)) {
            throw new TypeError('argument \'elem\' must be an instance of Buffer');
        }
        if (elem.length < 8) {
            throw new Error('argument \'elem\' length must be >= 8');
        }
        var flt = binary.parse(elem)
            .word32bs('mantissa')
            .word32bs('exponent')
            .buffer('rest', elem.length - 8)
            .vars;
        flt.content = parseFloat(((Math.pow(2, flt.exponent)) * (flt.mantissa / (1 << 30))).toFixed(6));
        return flt;
    },
    /**
     * decode string
     * @param {Buffer} elem throws error if not an instance of Buffer or if length <4
     * @returns {object} properties content and rest
     */
    decodeString: function (elem) {
        if (!(elem instanceof Buffer)) {
            throw new TypeError('argument \'elem\' must be an instance of Buffer');
        }
        if (elem.length < 4) {
            throw new Error('argument \'elem\' length must be >= 4');
        }
        var str = binary.parse(elem)
            .word32bu('strLength')
            .buffer('strContent', 'strLength')
            .buffer('rest', elem.length - 4)
            .vars;
        str.content = str.strContent.toString();
        return str;
    },
    /**
     * decode double
     * @param {Buffer} elem throws error if not an instance of Buffer or if length <8
     * @returns {object} properties content and rest
     */
    decodeBool: function (elem) {
        if (!(elem instanceof Buffer)) {
            throw new TypeError('argument \'elem\' must be an instance of Buffer');
        }
        if (elem.length === 0) {
            throw new Error('argument \'elem\' length must be >= 4');
        }
        var res = binary.parse(elem)
            .word8('value')
            .buffer('rest', elem.length - 1)
            .vars;
        res.content = res.value === 1;
        return res;
    },
    /**
     * decode integer
     * @param {Buffer} elem throws error if not an instance of Buffer or if length <4
     * @returns {object} properties content and rest
     */
    decodeInteger: function (elem) {
        if (!(elem instanceof Buffer)) {
            throw new TypeError('argument \'elem\' must be an instance of Buffer');
        }
        if (elem.length < 4) {
            throw new Error('argument \'elem\' length must be >= 4');
        }
        var int = binary.parse(elem)
            .word32bu('value')
            .buffer('rest', elem.length - 4)
            .vars;
        if (int.value & 0x80000000) {
            int.value -= 0x100000000;
        }
        int.content = int.value;
        return int;
    },
    /**
     * decode array
     * @param {Buffer} elem throws error if not an instance of Buffer or if length <4
     * @returns {object} properties content and rest
     */
    decodeArray: function (elem) {
        if (!(elem instanceof Buffer)) {
            throw new TypeError('argument \'elem\' must be an instance of Buffer');
        }
        if (elem.length < 4) {
            throw new Error('argument \'elem\' length must be >= 4');
        }
        var arr = binary.parse(elem)
            .word32bu('elementCount')
            .buffer('elements', elem.length - 4)
            .vars;
        var elements = arr.elements;
        var result = [];

        for (var i = 0; i < arr.elementCount; i++) {
            if (!elements) {
                return {content: '', rest: undefined};
            }
            var res = this.decodeData(elements);
            result.push(res.content);
            elements = res.rest;
        }
        return {content: result, rest: elements};
    },
    /**
     * decode struct
     * @param {Buffer} elem throws error if not an instance of Buffer or if length <4
     * @returns {object} properties content and rest
     */
    decodeStruct: function (elem) {
        if (!(elem instanceof Buffer)) {
            throw new TypeError('argument \'elem\' must be an instance of Buffer');
        }
        if (elem.length < 4) {
            throw new Error('argument \'elem\' length must be >= 4');
        }
        var struct = binary.parse(elem)
            .word32bu('elementCount')
            .buffer('elements', elem.length - 4)
            .vars;
        var elements = struct.elements;
        var result = {};
        for (var i = 0; i < struct.elementCount; i++) {
            var key = binary.parse(elements)
                .word32bu('keylength')
                .buffer('key', 'keylength')
                .buffer('rest', elements.length - 4) // length is bigger than buffer - doesn't matter
                .vars;
            elements = key.rest;
            var tmp = this.decodeData(elements);
            elements = tmp.rest;
            result[key.key.toString()] = tmp.content;
        }
        return {content: result, rest: elements};
    },
    /**
     * decodes binary data
     * @param {Buffer} data
     * @returns {*}
     *
     */
    decodeData: function (data) {
        if (!(data instanceof Buffer)) {
            throw new TypeError('argument \'elem\' must be an instance of Buffer');
        }
        if (data.length === 0) {
            return;
        }

        var res = binary.parse(data)
            .word32bu('dataType')
            .buffer('elements', data.length)
            .vars;
        if (!res || !res.dataType) {
            console.log('<-- binrpc error: unknown response ' + JSON.stringify(res) + ' :(');
            return;
        }

        switch (res.dataType) {
            case 0x101:
                return this.decodeStruct(res.elements);
            case 0x100:
                return this.decodeArray(res.elements);
            case 0x04:
                return this.decodeDouble(res.elements);
            case 0x03:
                return this.decodeString(res.elements);
            case 0x02:
                return this.decodeBool(res.elements);
            case 0x01:
                return this.decodeInteger(res.elements);
            default:
                console.log('<-- binrpc error: unknown data type ' + res.dataType.toString(16) + ' :(');
        }
    },
    /**
     * decode response
     * @param {Buffer} data throws TypeError if data is no instance of Buffer
     * @returns {*}
     */
    decodeResponse: function (data) {
        if (!(data instanceof Buffer)) {
            throw new TypeError('argument \'elem\' must be an instance of Buffer');
        }
        var vars = binary.parse(data)
            .buffer('head', 3)
            .word8('msgType')
            .word32bu('msgSize')
            .buffer('body', 'msgSize')
            .vars;
        if (vars.head.toString() !== 'Bin') {
            // console.log('<-- error: malformed header ' + vars.head.toString() );
            return false;
        }

        vars.head = vars.head.toString();

        var res;

        switch (vars.msgType) {
            case 0x01:
                res = this.decodeData(vars.body);
                break;
            case 0xFF:
                res = this.decodeData(vars.body);
                break;
            default:
                // console.log("<-- error: wrong msgType in response", vars.msgType);
                // console.log(this.decodeData(vars.body));
                return false;
        }
        if (!res) {
            return;
        }

        // if (res.rest.length > 0) {
        // console.log("rest..... ", res.rest.toString());
        // console.log(res.rest);
        // }
        return res.content;
    },
    /**
     * decode "strange" request
     * @param {Buffer} data throws TypeError if data is no instance of Buffer
     * @returns {Array}
     */
    decodeStrangeRequest: function (data) {
        if (!(data instanceof Buffer)) {
            throw new TypeError('argument \'elem\' must be an instance of Buffer');
        }
        var that = this;
        var arr = [];
        var rec = function (data) {
            if (data) {
                var tmp = that.decodeData(data);
                if (tmp) {
                    arr.push(tmp.content);
                    if (tmp.rest && tmp.rest.length > 0) {
                        rec(tmp.rest);
                    }
                }
            }
        };
        rec(data);
        return arr;
    },
    /**
     * decode request
     * @param {Buffer} data throws TypeError if not instance of Buffer
     * @returns {*}
     */
    decodeRequest: function (data) {
        if (!(data instanceof Buffer)) {
            throw new TypeError('argument \'elem\' must be an instance of Buffer');
        }
        var vars = binary.parse(data)
            .buffer('head', 3)
            .word8('msgType')
            .word32bu('msgSize')
            .buffer('body', data.length)
            .vars;
        if (vars.head.toString() !== 'Bin') {
            // console.log('<-- error: malformed sendRequest header received');
            return false;
        }

        vars.head = vars.head.toString();

        var req = binary.parse(vars.body)
            .word32bu('strSize')
            .buffer('method', 'strSize')
            .word32bu('elementcount')
            .buffer('data', data.length)
            .vars;
        if (vars.msgType === 0) {
            var res = this.decodeStrangeRequest(req.data);
            var method = req.method.toString();
            return {method: method, params: res};
        }
        // console.log('<-- error: wrong msgType in sendRequest');
        return false;
    }

};

module.exports = Protocol;
