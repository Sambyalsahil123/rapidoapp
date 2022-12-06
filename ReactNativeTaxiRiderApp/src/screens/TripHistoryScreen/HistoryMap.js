import React, { useRef, useEffect } from 'react'
import { useTheme } from 'dopenative'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'

export default function HistoryMap({
  origin,
  destination,
  coordinates,
  zoomEnabled,
  scrollEnabled,
}) {
  const { theme } = useTheme()

  const mapRef = useRef(null)

  useEffect(() => {
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: {
        right: 20,
        left: 20,
        top: 20,
        bottom: 20,
      },
      animated: true,
    })
  }, [])

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      loadingEnabled={true}
      showsUserLocation={false}
      zoomEnabled={zoomEnabled}
      scrollEnabled={scrollEnabled}
      // provider={PROVIDER_GOOGLE}
    >
      {coordinates?.length > 0 && (
        <>
          <Polyline
            coordinates={coordinates}
            strokeColor="#000"
            strokeWidth={3}
          />
          <Marker
            key={`${origin?.latitude}${origin?.longitude}`}
            coordinate={coordinates[0]}
            image={theme.icons.markerImage}
            anchor={{ x: 0, y: 0 }}
          />
          <Marker
            key={`${destination?.latitude}${destination?.longitude}`}
            coordinate={coordinates[coordinates?.length - 1]}
            image={theme.icons.markerImage}
            anchor={{ x: 0, y: 0 }}
          />
        </>
      )}
    </MapView>
  )
}
