'use client'
import React, { useEffect } from 'react';
import Intercom from '@intercom/messenger-js-sdk';

export default function IntercomComponent({ user }) {
  useEffect(() => {
    if (user && user.role === 'PARENT') {
      console.log('Initializing Intercom for parent user:', user);
      
      try {
        Intercom({
          app_id: 's7liy0vw',
          user_id: user.id,
          name: user.name,
          email: user.email,
          created_at: Math.floor(new Date(user.createdAt).getTime() / 1000)
        });
      } catch (error) {
        console.error('Intercom initialization error:', error);
      }
    }
  }, [user]);

  return null;
}
