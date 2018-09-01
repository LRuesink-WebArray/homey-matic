binrpc
======

[![npm version](https://badge.fury.io/js/binrpc.svg)](https://badge.fury.io/js/binrpc) 
[![npm downloads](https://img.shields.io/npm/dm/binrpc.svg)](https://www.npmjs.com/package/binrpc)
[![Dependencies Status](https://david-dm.org/hobbyquaker/binrpc/status.svg)](https://david-dm.org/hobbyquaker/binrpc)
[![Coverage Status](https://coveralls.io/repos/github/hobbyquaker/binrpc/badge.svg?branch=master)](https://coveralls.io/github/hobbyquaker/binrpc?branch=master)
[![Build Status](https://travis-ci.org/hobbyquaker/binrpc.svg?branch=master)](https://travis-ci.org/hobbyquaker/binrpc)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License][mit-badge]][mit-url]

[mit-badge]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat
[mit-url]: LICENSE

> HomeMatic xmlrpc_bin:// protocol server and client

For use with CCU1/2 (rfd, hs485d, Rega), Homegear and CUxD

Implements the same interface as [homematic-xmlrpc](https://github.com/hobbyquaker/homematic-xmlrpc), these 2 libs 
should be a 1:1 drop-in-replacement for each other.


## Changelog

**Breaking Change in v3.0.0:** To be consistent with [homematic-xmlrpc](https://github.com/hobbyquaker/homematic-xmlrpc) 
the RPC client isn't an event emitter anymore. All errors have to be handled through the methodCall callback.

**Change in v2.1.0** To be consistent with [homematic-xmlrpc](https://github.com/hobbyquaker/homematic-xmlrpc) you don't 
have to wait for the client connect event before using methodCall.

**Breaking change in v2.0.0:** `system.multicall` isn't resolved in single calls anymore. This should be
done by the application itself and was removed to be consistent with 
[homematic-xmlrpc](https://github.com/hobbyquaker/homematic-xmlrpc).


## Examples

Switch on the Channel `LEQ0134153:1`
```javascript
var rpc = require('binrpc');

var rpcClient = rpc.createClient({host: '192.168.1.100', port: '2001'});

rpcClient.methodCall('setValue', ['LEQ0134153:1', 'STATE', true], function (err, res) {
    console.log('response', err, JSON.stringify(res));
});

```


For a full example on how to subscribe to CCU events see [example.js](example.js)


## Further reading

* [HomeMatic RPC Schnittstellen Dokumentation, eQ-3 (German)](http://www.eq-3.de/Downloads/eq3/download%20bereich/hm_web_ui_doku/HM_XmlRpc_API.pdf)
* [BIN-RPC reference by Sathya (with Homegear extensions) (English)](https://www.homegear.eu/index.php/Binary_RPC_Reference)
* [BIN-RPC protocol description by leonsio, homematic-forum (German)](http://homematic-forum.de/forum/viewtopic.php?t=8210&p=57493)


## API Documentation

## Modules

<dl>
<dt><a href="#module_binrpc">binrpc</a></dt>
<dd></dd>
<dt><a href="#module_client">client</a></dt>
<dd></dd>
<dt><a href="#module_protocol">protocol</a></dt>
<dd></dd>
<dt><a href="#module_server">server</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#Client">Client</a></dt>
<dd></dd>
<dt><a href="#Protocol">Protocol</a></dt>
<dd></dd>
<dt><a href="#Server">Server</a></dt>
<dd></dd>
</dl>

<a name="module_binrpc"></a>

## binrpc

* [binrpc](#module_binrpc)
    * [.createClient(options)](#module_binrpc.createClient) ⇒ <code>[Client](#Client)</code>
    * [.createServer(options)](#module_binrpc.createServer) ⇒ <code>[Server](#Server)</code>

<a name="module_binrpc.createClient"></a>

### binrpc.createClient(options) ⇒ <code>[Client](#Client)</code>
RPC client factory

**Kind**: static method of <code>[binrpc](#module_binrpc)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  |  |
| options.host | <code>string</code> |  | the hostname or ip address to connect to |
| options.port | <code>number</code> |  | the port to connect to |
| [options.reconnectTimeout] | <code>number</code> | <code>2500</code> | wait milliseconds until trying to reconnect after the socket was closed |
| [options.queueMaxLength] | <code>number</code> | <code>15</code> | maximum number of methodCalls that are allowed in the queue |

<a name="module_binrpc.createServer"></a>

### binrpc.createServer(options) ⇒ <code>[Server](#Server)</code>
RPC server factory

**Kind**: static method of <code>[binrpc](#module_binrpc)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.host | <code>string</code> | ip address on which the server should listen |
| options.port | <code>number</code> | port on which the server should listen |

<a name="module_client"></a>

## client

* [client](#module_client)
    * [.queue](#module_client+queue) : <code>Array</code>
    * [.queueMaxLength](#module_client+queueMaxLength) : <code>number</code>
    * [.queueRetryTimeout](#module_client+queueRetryTimeout) : <code>number</code>
    * [.pending](#module_client+pending) : <code>boolean</code>
    * [.connect(reconnect)](#module_client+connect)
    * [.queuePush(buf, cb)](#module_client+queuePush)
    * [.queueShift()](#module_client+queueShift)
    * [.methodCall(method, params, callback)](#module_client+methodCall)

<a name="module_client+queue"></a>

### client.queue : <code>Array</code>
The request queue. Array elements must be objects with the properties buffer and callback

**Kind**: instance property of <code>[client](#module_client)</code>  
<a name="module_client+queueMaxLength"></a>

### client.queueMaxLength : <code>number</code>
Maximum queue length. If queue length is greater than this a methodCall will return error 'You are sending too fast'

**Kind**: instance property of <code>[client](#module_client)</code>  
<a name="module_client+queueRetryTimeout"></a>

### client.queueRetryTimeout : <code>number</code>
Time in milliseconds. How long to wait for retry if a request is pending

**Kind**: instance property of <code>[client](#module_client)</code>  
<a name="module_client+pending"></a>

### client.pending : <code>boolean</code>
Indicates if there is a request waiting for its response

**Kind**: instance property of <code>[client](#module_client)</code>  
<a name="module_client+connect"></a>

### client.connect(reconnect)
connect

**Kind**: instance method of <code>[client](#module_client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| reconnect | <code>boolean</code> | optional - defaults to false. Set to true if this is a reconnect |

<a name="module_client+queuePush"></a>

### client.queuePush(buf, cb)
Push request to the queue

**Kind**: instance method of <code>[client](#module_client)</code>  

| Param | Type |
| --- | --- |
| buf | <code>buffer</code> | 
| cb | <code>function</code> | 

<a name="module_client+queueShift"></a>

### client.queueShift()
Shift request from the queue and write it to the socket.

**Kind**: instance method of <code>[client](#module_client)</code>  
<a name="module_client+methodCall"></a>

### client.methodCall(method, params, callback)
methodCall

**Kind**: instance method of <code>[client](#module_client)</code>  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> |  |
| params | <code>Array</code> |  |
| callback | <code>function</code> | optional - if omitted an empty string will be send as response |

<a name="module_protocol"></a>

## protocol

* [protocol](#module_protocol)
    * [.encodeRequest(method, data)](#module_protocol.encodeRequest) ⇒ <code>Buffer</code>
    * [.encodeResponse(data)](#module_protocol.encodeResponse) ⇒ <code>Buffer</code>
    * [.encodeData(obj)](#module_protocol.encodeData) ⇒ <code>Buffer</code>
    * [.encodeStruct(obj)](#module_protocol.encodeStruct) ⇒ <code>Buffer</code>
    * [.encodeStructKey(str)](#module_protocol.encodeStructKey) ⇒ <code>Buffer</code>
    * [.encodeArray(arr)](#module_protocol.encodeArray) ⇒ <code>Buffer</code>
    * [.encodeString(str)](#module_protocol.encodeString) ⇒ <code>Buffer</code>
    * [.encodeBool(b)](#module_protocol.encodeBool) ⇒ <code>Buffer</code>
    * [.encodeInteger(i)](#module_protocol.encodeInteger) ⇒ <code>Buffer</code>
    * [.encodeDouble(d)](#module_protocol.encodeDouble) ⇒ <code>Buffer</code>
    * [.decodeDouble(elem)](#module_protocol.decodeDouble) ⇒ <code>object</code>
    * [.decodeString(elem)](#module_protocol.decodeString) ⇒ <code>object</code>
    * [.decodeBool(elem)](#module_protocol.decodeBool) ⇒ <code>object</code>
    * [.decodeInteger(elem)](#module_protocol.decodeInteger) ⇒ <code>object</code>
    * [.decodeArray(elem)](#module_protocol.decodeArray) ⇒ <code>object</code>
    * [.decodeStruct(elem)](#module_protocol.decodeStruct) ⇒ <code>object</code>
    * [.decodeData(data)](#module_protocol.decodeData) ⇒ <code>\*</code>
    * [.decodeResponse(data)](#module_protocol.decodeResponse) ⇒ <code>\*</code>
    * [.decodeStrangeRequest(data)](#module_protocol.decodeStrangeRequest) ⇒ <code>Array</code>
    * [.decodeRequest(data)](#module_protocol.decodeRequest) ⇒ <code>\*</code>

<a name="module_protocol.encodeRequest"></a>

### protocol.encodeRequest(method, data) ⇒ <code>Buffer</code>
encode requests

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | throws error if not type string or if string is empty |
| data | <code>\*</code> | optional - defaults to an empty array |

<a name="module_protocol.encodeResponse"></a>

### protocol.encodeResponse(data) ⇒ <code>Buffer</code>
encode response

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | optional - defaults to empty string |

<a name="module_protocol.encodeData"></a>

### protocol.encodeData(obj) ⇒ <code>Buffer</code>
encode data

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | throws TypeError if obj is undefined or null |

<a name="module_protocol.encodeStruct"></a>

### protocol.encodeStruct(obj) ⇒ <code>Buffer</code>
encode struct

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | throws error if not of type object |

<a name="module_protocol.encodeStructKey"></a>

### protocol.encodeStructKey(str) ⇒ <code>Buffer</code>
encode struct key

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | throws error if not of type string |

<a name="module_protocol.encodeArray"></a>

### protocol.encodeArray(arr) ⇒ <code>Buffer</code>
encode array

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>array</code> | throws error if not instance of Array |

<a name="module_protocol.encodeString"></a>

### protocol.encodeString(str) ⇒ <code>Buffer</code>
encode string

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | throws error if not of type string |

<a name="module_protocol.encodeBool"></a>

### protocol.encodeBool(b) ⇒ <code>Buffer</code>
encode bool

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| b | <code>\*</code> | any type |

<a name="module_protocol.encodeInteger"></a>

### protocol.encodeInteger(i) ⇒ <code>Buffer</code>
encode integer

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | throws error if not a number or if out of range (min=-2147483648 max=2147483647) |

<a name="module_protocol.encodeDouble"></a>

### protocol.encodeDouble(d) ⇒ <code>Buffer</code>
encode double

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| d | <code>number</code> | throws error if not a number |

<a name="module_protocol.decodeDouble"></a>

### protocol.decodeDouble(elem) ⇒ <code>object</code>
decode double

**Kind**: static method of <code>[protocol](#module_protocol)</code>  
**Returns**: <code>object</code> - properties content and rest  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Buffer</code> | throws error if not an instance of Buffer or if length <8 |

<a name="module_protocol.decodeString"></a>

### protocol.decodeString(elem) ⇒ <code>object</code>
decode string

**Kind**: static method of <code>[protocol](#module_protocol)</code>  
**Returns**: <code>object</code> - properties content and rest  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Buffer</code> | throws error if not an instance of Buffer or if length <4 |

<a name="module_protocol.decodeBool"></a>

### protocol.decodeBool(elem) ⇒ <code>object</code>
decode double

**Kind**: static method of <code>[protocol](#module_protocol)</code>  
**Returns**: <code>object</code> - properties content and rest  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Buffer</code> | throws error if not an instance of Buffer or if length <8 |

<a name="module_protocol.decodeInteger"></a>

### protocol.decodeInteger(elem) ⇒ <code>object</code>
decode integer

**Kind**: static method of <code>[protocol](#module_protocol)</code>  
**Returns**: <code>object</code> - properties content and rest  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Buffer</code> | throws error if not an instance of Buffer or if length <4 |

<a name="module_protocol.decodeArray"></a>

### protocol.decodeArray(elem) ⇒ <code>object</code>
decode array

**Kind**: static method of <code>[protocol](#module_protocol)</code>  
**Returns**: <code>object</code> - properties content and rest  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Buffer</code> | throws error if not an instance of Buffer or if length <4 |

<a name="module_protocol.decodeStruct"></a>

### protocol.decodeStruct(elem) ⇒ <code>object</code>
decode struct

**Kind**: static method of <code>[protocol](#module_protocol)</code>  
**Returns**: <code>object</code> - properties content and rest  

| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Buffer</code> | throws error if not an instance of Buffer or if length <4 |

<a name="module_protocol.decodeData"></a>

### protocol.decodeData(data) ⇒ <code>\*</code>
decodes binary data

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type |
| --- | --- |
| data | <code>Buffer</code> | 

<a name="module_protocol.decodeResponse"></a>

### protocol.decodeResponse(data) ⇒ <code>\*</code>
decode response

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> | throws TypeError if data is no instance of Buffer |

<a name="module_protocol.decodeStrangeRequest"></a>

### protocol.decodeStrangeRequest(data) ⇒ <code>Array</code>
decode "strange" request

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> | throws TypeError if data is no instance of Buffer |

<a name="module_protocol.decodeRequest"></a>

### protocol.decodeRequest(data) ⇒ <code>\*</code>
decode request

**Kind**: static method of <code>[protocol](#module_protocol)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> | throws TypeError if not instance of Buffer |

<a name="module_server"></a>

## server
<a name="Client"></a>

## Client
**Kind**: global class  
<a name="new_Client_new"></a>

### new Client(options)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  |  |
| options.host | <code>string</code> |  | the hostname or ip address to connect to |
| options.port | <code>number</code> |  | the port to connect to |
| [options.reconnectTimeout] | <code>number</code> | <code>2500</code> | wait milliseconds until trying to reconnect after the socket was closed |
| [options.queueMaxLength] | <code>number</code> | <code>15</code> | maximum number of methodCalls that are allowed in the queue |

<a name="Protocol"></a>

## Protocol
**Kind**: global class  
<a name="Server"></a>

## Server
**Kind**: global class  

* [Server](#Server)
    * [new Server(options)](#new_Server_new)
    * ["[method]" (error, params, callback)](#Server+event_[method])
    * ["NotFound" (method, params)](#Server+event_NotFound)

<a name="new_Server_new"></a>

### new Server(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.host | <code>string</code> | ip address on which the server should listen |
| options.port | <code>number</code> | port on which the server should listen |

<a name="Server+event_[method]"></a>

### "[method]" (error, params, callback)
Fires when RPC method call is received

**Kind**: event emitted by <code>[Server](#Server)</code>  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>\*</code> |  |
| params | <code>array</code> |  |
| callback | <code>function</code> | callback awaits params err and response |

<a name="Server+event_NotFound"></a>

### "NotFound" (method, params)
Fires if a RPC method call has no event handler.
RPC response is always an empty string.

**Kind**: event emitted by <code>[Server](#Server)</code>  

| Param | Type |
| --- | --- |
| method | <code>string</code> | 
| params | <code>array</code> | 


## License

The MIT License (MIT)

Copyright (c) 2014-2018 Sebastian 'hobbyquaker' Raff and Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
