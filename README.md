# ***** This app is still in Beta *****

# Homematic

This app adds support for Homematic device in Homey via the CCU2/CCU3/RaspberryMatic

What works:

Devices can be connected via the following interfaces to the CCU:

* BidCos
* Homematic IP
* CUxD

The following devices are currently implemented:

* HM-Sec-SCo
* HM-SwI-3-FM
* HM-PB-4-WM (this curently only works with EnOcean devices like Eltako FT55 via CUxD)
* HM-WS550STH-I (tested via CUxD)
* HMIP-eTRV
* HmIP-eTRV-2
* HmIP-SPI
* HMIP-SWDO
* HMIP-WTH
* HMIP-PSM
* H-LC-Dim1T-FM
* HM-LC-Sw1-FM
* HmIP-WRC6
* HmIP-MOD-OC8
* HmIP-SWD
* HM-LC-Sw2-FM
* HM-Sec-RHS
* HM-Sec-SD-2

Known issues:

It is required that the Homey IP and the CCU IP are configured in the settings of the app. The app needs to be restarted after the settings have been saved.

The IP of the Homey is required as the app runs an RPC server for each interface that are required by the CCU to sends events to.