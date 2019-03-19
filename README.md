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
* HM-LC-Sw1-FM
* HmIP-WRC6
* HmIP-MOD-OC8
* HmIP-SWD
* HM-LC-Sw2-FM
* HM-Sec-RHS
* HM-Sec-SD-2
* HM-ES-PMSw1-Pl
* HM-Sec-Key

If you have a device that is not supported currently then please open an issue on github and we will look into it.

The app uses discovery to find your CCUs on the network. We were only able to test it with a single CCU yet. Therefore it is possible that the app fails in case multiple CCUs are discovered on the network.
