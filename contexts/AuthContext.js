import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
          console.log('Loaded user data:', parsedUserData); // Log loaded user data
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (userData) => {
    try {
      // Ensure userData contains userID
      if (!userData.userID) {
        throw new Error('User data does not contain userID');
      }
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      console.log('Logged in user data:', userData); // Log user data on login
    } catch (error) {
      console.error('Error logging in user:', error);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
