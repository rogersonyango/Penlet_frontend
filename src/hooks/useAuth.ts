// // src/hooks/useAuth.ts
// import { useState, useEffect } from 'react';
// import { User } from '../types/quiz';

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const role = (localStorage.getItem('mockUser') || 'student') as any;
//     const safeRole = ['teacher', 'admin'].includes(role) ? role : 'student';
//     setUser({
//       email: `${safeRole}@example.com`,
//       role: safeRole,
//     });
//     setLoading(false);
//   }, []);

//   const loginAs = (role: 'student' | 'teacher' | 'admin') => {
//     localStorage.setItem('mockUser', role);
//     setUser({
//       email: `${role}@example.com`,
//       role,
//     });
//   };

//   return { user, loading, loginAs };
// };



// src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { User, Role } from '../types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem('mockUser');
    // Validate role
    const role: Role = ['teacher', 'admin'].includes(storedRole as Role)
      ? (storedRole as Role)
      : 'student';

    setUser({
      email: `${role}@example.com`,
      role,
    });
    setLoading(false);
  }, []);

  const loginAs = (role: Role) => {
    localStorage.setItem('mockUser', role);
    setUser({
      email: `${role}@example.com`,
      role,
    });
  };

  const logout = () => {
    localStorage.removeItem('mockUser');
    setUser(null);
  };

  return { user, loading, loginAs, logout };
};