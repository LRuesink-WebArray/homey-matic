# ***** This app is still in Beta *****

# Homematic

This app adds support for Homematic device in Homey via the CCU2/CCU3/RaspberryMatic

What works:

Devices can be connected via the following interfaces to the CCU:

* BidCos
* Homematic IP
* CUxD

## MQTT

As of 0.15.0 the app also supports the connection to the CCU via MQTT. This feature is currently cosidered experimental. The reason it is considered experimental is that it might be required to make some changes on the CCU in future versions of the app which could cause the app not to work until the changes are implemented.

It depends on RedMatic (Node Red) and Mosquitto (MQTT broker) to be configured on the CCU and therefore only supports the CCU3 ud RaspberryMatic.

The implementation is fully compatible with the existing devices that have been paired before it was enabled. It is also possible to switch back to the old mode without requiring to pair devices again.

MQTT is more stable than the connection via RPC as used otherwise. It also fixes the issue that some users have been experiencing where the devices stopped working after some time and a restart of the app was required to fix it. The performance is also increased which means that switch operations as executed faster and more reliable.

See the [Wiki](https://github.com/twendt/homey-matic/wiki/MQTT-Setup) for a detailed description on setting it up.

I recommend not to enable the auto update of this app in Homey and always check this page to make sure that no action is required before updating the app.

If you encounter any issues then please open an issue on GitHub.

## Supported devices

* HM-CC-RT-DN
* HM-ES-PMSw1-DR
* HM-ES-PMSw1-Pl
* HM-ES-TX-WM
* HM-LC-Bl1-FM
* HM-LC-Bl1PBU-FM
* HM-LC-Dim1PWM-CV
* HM-LC-Dim1T-DR
* HM-LC-Dim1T-FM
* HM-LC-Dim1TPBU-FM
* HM-LC-Sw1-Ba-PCB
* HM-LC-Sw1-DR
* HM-LC-Sw1-FM
* HM-LC-Sw1-Pl
* HM-LC-Sw1-Pl-CT-R1
* HM-LC-Sw1-Pl-DN-R1
* HM-LC-Sw1PBU-FM
* HM-LC-Sw2-FM
* HM-LC-Sw4-Ba-PCB
* HM-LC-Sw4-DR
* HM-LC-Sw4-SM
* HM-LC-Sw4-WM
* HM-MOD-Re-8
* HM-OU-LED16
* HM-PB-2-FM
* HM-PB-2-WM55-2
* HM-PB-4-WM
* HM-PB-6-WM55
* HM-PBI-4-FM
* HM-RC-8
* HM-RC-Key4-2
* HM-RC-Key4-3
* HM-Sec-Key
* HM-Sec-MDIR-2
* HM-Sec-RHS
* HM-Sec-SC
* HM-Sec-SC-2
* HM-Sec-SCo
* HM-Sec-SD
* HM-Sec-SD-2
* HM-Sec-Sir-WM
* HM-Sec-WDS
* HM-Sen-DB-PCB
* HM-Sen-MDIR-O
* HM-Sen-MDIR-WM55
* HM-Sen-RD-O
* HM-SwI-3-FM
* HM-TC-IT-WM-W-EU
* HM-WDS10-TH-O
* HM-WDS100-C6-O
* HM-WS550STH-I
* HMIP-PSM
* HMIP-SWDO
* HMIP-WRC2
* HMIP-WTH
* HMIP-eTRV
* HmIP-BDT
* HmIP-BRC2
* HmIP-BROLL
* HmIP-BSM
* HmIP-BWTH
* HmIP-FBL
* HmIP-FROLL
* HmIP-FSM
* HmIP-MOD-OC8
* HmIP-PCBS
* HmIP-SLO
* HmIP-SMI
* HmIP-SMO-A
* HmIP-SPI
* HmIP-STH
* HmIP-STHD
* HmIP-STHO
* HmIP-SWD
* HmIP-SWDM
* HmIP-SWDO-I
* HmIP-SWSD
* HmIP-WRC6
* HmIP-eTRV-2
* HmIP-eTRV-B
* HmIP-eTRV-C

If you have a device that is not supported currently then please open an issue on github and we will look into it.

The app uses discovery to find your CCUs on the network. We were only able to test it with a single CCU yet. Therefore it is possible that the app fails in case multiple CCUs are discovered on the network.

# Credits

Thank you [@hobbyquaker](https://github.com/hobbyquaker) for your great work on binrpc, xmlrpc, hm-discover and RedMatic.