import { createContext, useContext, useEffect, useState } from 'react';
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth';
import {
  deleteUserRequest,
  getUserRequest,
  getUsersRequest,
  updateUserRequest,
} from '../api/users.js';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signUp = async (user) => {
    try {
      await registerRequest(user);
    } catch (error) {
      setErrors(error.response.data);
      console.log(error);
    }
  };

  const signIn = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.response.data);
      console.log(error);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = async (userId, newUser) => {
    try {
      const res = await updateUserRequest(userId, newUser);
      return res;
    } catch (error) {
      setErrors(error.response.data);
      console.log(error);
    }
  };

  const getUsers = async () => {
    try {
      const res = await getUsersRequest();
      return res.data;
    } catch (error) {
      setErrors(error.response.data);
      console.log(error);
    }
  };

  const getUser = async (id) => {
    try {
      const res = await getUserRequest(id);
      return res.data;
    } catch (error) {
      setErrors(error.response.data);
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await deleteUserRequest(id);
      return res.data;
    } catch (error) {
      setErrors(error.response.data);
      console.log(error);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          setUser(null);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        logout,
        loading,
        user,
        isAuthenticated,
        errors,
        updateUser,
        getUsers,
        getUser,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
