import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  MapScreen: {
    userType: 'buyer' | 'seller';
  };
};

type MapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MapScreen'>;
type MapScreenRouteProp = RouteProp<RootStackParamList, 'MapScreen'>;

type Props = {
  navigation: MapScreenNavigationProp;
  route: MapScreenRouteProp;
};

type Location = {
  latitude: number;
  longitude: number;
  address: string;
  userType: 'buyer' | 'seller';
};

const MapScreen = ({ route, navigation }: Props) => {
  const { userType } = route.params;
  const [address, setAddress] = useState('');
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    loadSavedLocations();
  }, []);

  // Calculate appropriate region to show all markers
  const calculateRegion = (locations: Location[], currentMarker: { latitude: number; longitude: number; } | null) => {
    // Convert Location objects to simple lat/lng points so we can push currentMarker without type error
    const points: { latitude: number; longitude: number }[] = locations.map(loc => ({
      latitude: loc.latitude,
      longitude: loc.longitude,
    }));
    if (currentMarker) {
      points.push(currentMarker);
    }

    if (points.length === 0) return null;
    
    if (points.length === 1) {
      return {
        latitude: points[0].latitude,
        longitude: points[0].longitude,
        latitudeDelta: 0.01, // Closer zoom for single point
        longitudeDelta: 0.01,
      };
    }

    let minLat = points[0].latitude;
    let maxLat = points[0].latitude;
    let minLng = points[0].longitude;
    let maxLng = points[0].longitude;

    points.forEach(point => {
      minLat = Math.min(minLat, point.latitude);
      maxLat = Math.max(maxLat, point.latitude);
      minLng = Math.min(minLng, point.longitude);
      maxLng = Math.max(maxLng, point.longitude);
    });

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = (maxLat - minLat) * 1.5; // Add 50% padding
    const lngDelta = (maxLng - minLng) * 1.5;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  };

  const loadSavedLocations = async () => {
    try {
      const locations = await AsyncStorage.getItem('locations');
      if (locations) {
        const loadedLocations = JSON.parse(locations);
        setSavedLocations(loadedLocations);
        
        // Calculate initial region based on saved locations
        const newRegion = calculateRegion(loadedLocations, null);
        if (newRegion) {
          setRegion(newRegion);
        }
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newMarker = { latitude, longitude };
    setMarker(newMarker);
    
    // Calculate new region including the new marker
    const newRegion = calculateRegion(savedLocations, newMarker);
    if (newRegion) {
      setRegion(newRegion);
    }
    
    Keyboard.dismiss();
  };

  const handleSaveLocation = async () => {
    if (!marker || !address.trim()) {
      Alert.alert('Error', 'Please provide both location and address');
      return;
    }

    setLoading(true);
    try {
      const newLocation: Location = {
        ...marker,
        address,
        userType,
      };

      const updatedLocations = [...savedLocations, newLocation];
      await AsyncStorage.setItem('locations', JSON.stringify(updatedLocations));
      setSavedLocations(updatedLocations);
      
      // Update region to include all locations
      const newRegion = calculateRegion(updatedLocations, null);
      if (newRegion) {
        setRegion(newRegion);
      }

      Alert.alert(
        'Success',
        'Location saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save location');
      console.error('Error saving location:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onPress={handleMapPress}
        region={region}>
        {marker && (
          <Marker
            coordinate={marker}
            title={userType === 'seller' ? 'Tree Location' : 'Preferred Location'}
            description={address}
          />
        )}
        {savedLocations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.userType === 'seller' ? 'Tree Available' : 'Buyer Location'}
            description={location.address}
            pinColor={location.userType === 'seller' ? 'green' : 'blue'}
          />
        ))}
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.hint}>
          {marker
            ? 'Location selected! Enter address and save.'
            : 'Tap on the map to select location'}
        </Text>
        <TouchableOpacity
          style={[styles.button, !marker && styles.buttonDisabled]}
          onPress={handleSaveLocation}
          disabled={!marker || loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Save {userType === 'seller' ? 'Tree' : 'Preferred'} Location
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  footer: {
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hint: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MapScreen;