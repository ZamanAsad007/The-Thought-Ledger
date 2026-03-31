import { createContext, useState, useContext } from 'react'
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const[user, setUser]= useState(
        JSON.parse(localStorage.getItem('user'))||null
    );

    const login =(userData)=>{
        const currentUser = JSON.parse(localStorage.getItem('user')) || {};
        const updatedUser = { ...currentUser, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    const logout =()=>{
        setUser(null)
        localStorage.removeItem('user')
    }
  return (
    <div>
      <AuthContext.Provider value={{user, login, logout}}>
        {children}
      </AuthContext.Provider>
    </div>
  )
}

export const useAuth =()=>useContext (AuthContext)
