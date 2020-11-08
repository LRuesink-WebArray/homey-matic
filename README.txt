***** This app is still in Beta *****

Homematic
This app adds support for Homematic device in Homey via the CCU2/CCU3/RaspberryMatic

What works:

Devices can be connected via the following interfaces to the CCU:

BidCos
Homematic IP
CUxD
MQTT

As of 0.15.0 the app also supports the connection to the CCU via MQTT. This feature is currently cosidered experimental. The reason it is considered experimental is that it might be required to make some changes on the CCU in future versions of the app which could cause the app not to work until the changes are implemented.

It depends on RedMatic (Node Red) and Mosquitto (MQTT broker) to be configured on the CCU and therefore only supports the CCU3 ud RaspberryMatic.

The implementation is fully compatible with the existing devices that have been paired before it was enabled. It is also possible to switch back to the old mode without requiring to pair devices again.

MQTT is more stable than the connection via RPC as used otherwise. It also fixes the issue that some users have been experiencing where the devices stopped working after some time and a restart of the app was required to fix it. The performance is also increased which means that switch operations as executed faster and more reliable.

See the Wiki for a detailed description on setting it up.

I recommend not to enable the auto update of this app in Homey and always check this page to make sure that no action is required before updating the app.

If you encounter any issues then please open an issue on GitHub.

If you have a device that is not supported currently then please open an issue on github and we will look into it.

The app uses discovery to find your CCUs on the network. We were only able to test it with a single CCU yet. Therefore it is possible that the app fails in case multiple CCUs are discovered on the network.

Credits
Thank you @hobbyquaker for your great work on binrpc, xmlrpc, hm-discover and RedMatic.