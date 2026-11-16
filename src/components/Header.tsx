import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../config';

export const Header: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const checkApiConnection = async () => {
      try {
        const normalizedBaseUrl = BASE_URL.replace(/\/$/, '');
        const response = await fetch(`${normalizedBaseUrl}/users?_limit=1`);
        const isSuccess = response.ok || response.status === 304;
        if (isMounted && isSuccess) {
          setIsConnected(true);
        }
      } catch {
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    checkApiConnection();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-group">
          <div className="logo-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <h1 className="app-title">User & Posts Explorer</h1>
          </div>
        </div>

        <div className="header-badges">
          {isConnected ? (
            <span className="api-badge" title={`Conectado con ${BASE_URL}`}>
              <span className="status-dot" aria-hidden="true" />
              API Conectada
            </span>
          ) : (
            <>
              <span className="api-badge-des"> Buscando API...</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
