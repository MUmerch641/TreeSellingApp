import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type UserTypeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserType'>;

type Props = {
  navigation: UserTypeScreenNavigationProp;
};

const UserTypeScreen = ({ navigation }: Props) => {
  const handleUserTypeSelection = (type: 'buyer' | 'seller') => {
    navigation.navigate('MapScreen', { userType: type });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Your Role</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleUserTypeSelection('buyer')}>
          <Text style={styles.buttonText}>I'm a Buyer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleUserTypeSelection('seller')}>
          <Text style={styles.buttonText}>I'm a Seller</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default UserTypeScreen;