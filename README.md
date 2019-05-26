# ***** This app is still in Beta *****

# Homematic

This app adds support for Homematic device in Homey via the CCU2/CCU3/RaspberryMatic

What works:

Devices can be connected via the following interfaces to the CCU:

* BidCos
* Homematic IP
* CUxD

The following devices are currently implemented:

* HM-CC-RT-DN
* HM-ES-PMSw1-Pl
* HmIP-BROLL
* HmIP-BWTH
* HMIP-eTRV
* HmIP-eTRV-2
* HmIP-FROLL
* HmIP-MOD-OC8
* HmIP-PCBS
* HMIP-PSM
* HmIP-SPI
* HmIP-STH
* HmIP-STHD
* HmIP-STHO
* HmIP-SWD
* HMIP-SWDO
* HmIP-SWDO-I
* HmIP-WRC6
* HMIP-WTH
* HM-LC-Bl1PBU-FM
* HM-LC-Dim1PWM-CV
* HM-LC-Dim1T-DR
* HM-LC-Dim1T-FM
* HM-LC-Dim1TPBU-FM
* HM-LC-Sw1-Ba-PCB
* HM-LC-Sw1-DR
* HM-LC-Sw1-FM
* HM-LC-Sw1PBU-FM
* HM-LC-Sw1-Pl-CT-R1
* HM-LC-Sw1-Pl-DN-R1
* HM-LC-Sw2-FM
* HM-PB-4-WM
* HM-RC-Key4-2
* HM-RC-Key4-3
* HM-Sec-Key
* HM-Sec-MDIR-2
* HM-Sec-RHS
* HM-Sec-SC-2
* HM-Sec-SCo
* HM-Sec-SD-2
* HM-Sen-DB-PCB
* HM-Sen-MDIR-O
* HM-Sen-MDIR-WM55
* HM-SwI-3-FM
* HM-TC-IT-WM-W-EU
* HM-WDS10-TH-O
* HM-WS550STH-I

If you have a device that is not supported currently then please open an issue on github and we will look into it.

The app uses discovery to find your CCUs on the network. We were only able to test it with a single CCU yet. Therefore it is possible that the app fails in case multiple CCUs are discovered on the network.

# Credits

Thank you [@hobbyquaker](https://github.com/hobbyquaker) for your great work on binrpc, xmlrpc and hm-discover