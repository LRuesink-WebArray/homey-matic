#!/bin/bash

if [ $# != 1 ] ; then
  echo "Usage tools/copy-images.sh <path to occu repo>"
  exit 1
fi

OCCU_PATH=$1
OCCU_IMAGES="${OCCU_PATH}/WebUI/www/config/img/devices/250"

if ! [ -d drivers ] ; then
  echo "Script needs to be run from top directory"
  exit 1
fi

if ! [ -d ${OCCU_IMAGES} ] ; then
  echo "Not a valid occu repo directory"
  exit 1
fi

for drv in `ls drivers` ; do
  if ! [ -d drivers/$drv/assets/images ] ; then
    mkdir -p drivers/$drv/assets/images
  fi
  lower_drv=`echo $drv | tr [A-Z] [a-z]`

  # Handle special cases
  if [ $lower_drv == "hmip-etrv-2" ] ; then
    lower_drv="hmip-etrv"
  elif [ $lower_drv == "hm-pb-4-wm" ] ; then
    lower_drv="PushButton-4ch-wm"
  elif [ $lower_drv == "hm-pb-2-wm" ] ; then
    lower_drv="PushButton-2ch-wm"
  elif [ $lower_drv == "hm-sec-mdir-2" ] ; then
    lower_drv="hm-sec-mdir"
  elif [ $lower_drv == "hm-wds10-th-o" ] ; then
    lower_drv="TH_CS"
  elif [ $lower_drv == "hm-lc-sw1-pl-ct-r1" ] ; then
    lower_drv="hm-lc-sw1-pl-ct"
  elif [ $lower_drv == "hm-lc-dim1tpbu-fm" ] ; then
    lower_drv="PushButton-2ch-wm"
  elif [ $lower_drv == "hmip-broll" ] ; then
    lower_drv="157_hmip-broll_hmip-bbl"
  elif [ $lower_drv == "hmip-froll" ] ; then
    lower_drv="145_hmip-froll_hmip-fbl"
  elif [ $lower_drv == "hmip-bwth" ] ; then
    lower_drv="121_hmip-wth"
  elif [ $lower_drv == "hmip-smo-a" ] ; then
    lower_drv="132_hmip-smo"
  elif [ $lower_drv == "hm-lc-sw1-pl" ] ; then
    lower_drv="OM55_DimmerSwitch"
  elif [ $lower_drv == "hm-wds100-c6-o" ] ; then
    lower_drv="WeatherCombiSensor"
  elif [ $lower_drv == "hmip-pcbs" ] ; then
    lower_drv="184_hmip-pcbs2"
  elif [ $lower_drv == "hm-pb-2-fm" ] ; then
    lower_drv="PushButton-2ch-wm"
  elif [ $lower_drv == "hmip-brc2" ] ; then
    lower_drv="PushButton-2ch-wm"
  elif [ $lower_drv == "hmip-bsm" ] ; then
    lower_drv="PushButton-2ch-wm"
  elif [ $lower_drv == "hmip-swsd" ] ; then
    lower_drv="104_hm-sec-sd-2"
  fi
  
  if ! [ -f drivers/$drv/assets/images/large.png ] ; then
    convert -resize 500x500! ${OCCU_IMAGES}/*${lower_drv}.png drivers/$drv/assets/images/large.png
  fi
  if ! [ -f drivers/$drv/assets/images/small.png ] ; then
    convert -resize 75x75! ${OCCU_IMAGES}/*${lower_drv}.png drivers/$drv/assets/images/small.png
  fi
done
