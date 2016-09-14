mv /home/mark/buildVenues /home/mark/oldBuildVenues

meteor build /home/mark/buildVenues --server=http://thingitude.com:4000

cd /home/mark/buildVenues/Android

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 release-unsigned.apk hotspot-venues.apk

/home/mark/Android/Sdk/build-tools/*/zipalign 4 release-unsigned.apk hotspot-venues.apk
