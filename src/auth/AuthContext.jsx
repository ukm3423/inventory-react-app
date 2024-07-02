import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext();

export function AuthProvider({ children }) {



  const storedToken = localStorage.getItem('token');  // This is temporary solution 
  let val = false;
  if (storedToken != null) {
    val = true;
  }

  const [isAuthenticated, setIsAuthenticated] = useState(val);
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');



  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {

      validateToken(storedToken);

    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/authservice/api/check-validity', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("Validity : ", response.data);
      if (response.data) {
        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true);
        setToken(token);
        setRole(decodedToken.role);
        setName(decodedToken.name);
      } else {
        setIsAuthenticated(false);
        setToken('');
        setRole('');
        setName('');
      }
      return response.data; // Assuming the backend returns true or false indicating token validity
    } catch (error) {
      console.error('Error validating token', error);
      return false;
    }
  };

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]); // Log whenever isAuthenticated changes


  const login = (token) => {
    const decodedToken = jwtDecode(token);
    setIsAuthenticated(true);
    setToken(token);
    setRole(decodedToken.role);
    setName(decodedToken.name);
    console.log("ROLE : ",decodedToken.role)
    localStorage.setItem('token', token);
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8080/authservice/api/log-out', {}, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      setIsAuthenticated(false);
      setToken(''); // Clear token from state
      localStorage.removeItem('token');
      // nav('/login');
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, role, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
