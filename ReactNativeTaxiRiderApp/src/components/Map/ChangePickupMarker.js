import React, { useRef, useEffect } from 'react';
import { Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import * as Location from 'expo-location';
import { setOrigin } from '../../redux';

export default function ChangePickupMarker({ fitToCoordinates }) {
  const dispatch = useDispatch();
  const focusedBottomSheetKey = useSelector(
    ({ bottomSheet }) => bottomSheet.bottomSheetSnapPoints?.key,
  );
  const origin = useSelector(({ trip }) => trip.origin);

  const isDraging = useRef(false);

  const isConfirmingPickup = focusedBottomSheetKey === 'confirm_pickup';

  useEffect(() => {
    if (isDraging.current) {
      isDraging.current = false;
      return;
    }
    if (isConfirmingPickup) {
      fitToCoordinates([origin]);
    }
  }, [origin]);

  if (!isConfirmingPickup) {
    return null;
  }

  const setNewOrigin = async (newCoordinate) => {
    let json = await Location.reverseGeocodeAsync(newCoordinate);

    if (json) {
      const choosenIndex = Math.floor(json.length * 0.8);
      const location = json[choosenIndex];
      const place = {
        ...newCoordinate,
        title: location.name ?? location.street,
        placeId: newCoordinate.latitude,
        subtitle: location.city ?? location.street,
      };

      dispatch(setOrigin(place));
    }
  };

  const onDragStart = () => {
    isDraging.current = true;
  };

  const onDragEnd = (e) => {
    if (e.nativeEvent?.coordinate) {
      setNewOrigin(e.nativeEvent?.coordinate);
    }
  };

  return (
    <Marker
      key={`${origin.latitude}`}
      draggable={true}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      coordinate={origin}
    />
  );
}
