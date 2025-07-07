import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({
    db: false,
    express: false,
    redis: false,
    loadBalancer: false
  });

  const testEndpoint = async (endpoint) => {
    try {
      setLoading(prev => ({ ...prev, [endpoint]: true }));
      
      const response = await axios.get(`/api/test-${endpoint}`);
      
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          data: response.data,
          time: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: error.response?.status || 'Error',
          data: error.response?.data || error.message,
          time: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [endpoint]: false }));
    }
  };

  return (
    <div className="app-container">
      <h1>Webstack : 'ReactJS/Nginx'---Loadbalancer---Express---Mysql---Redis</h1>
      
      <div className="button-container">
        <button 
          onClick={() => testEndpoint('react-nginx')} 
          disabled={loading.db}
          className={loading.db ? 'loading' : ''}
        >
          {loading.db ? 'Testing...' : 'Test React/Nginx'}
        </button>

        <button 
          onClick={() => testEndpoint('proxy')} 
          disabled={loading.loadBalancer}
          className={loading.loadBalancer ? 'loading' : ''}
        >
          {loading.loadBalancer ? 'Testing...' : 'Test Proxy Nginx'}
        </button>

        <button 
          onClick={() => testEndpoint('express')} 
          disabled={loading.express}
          className={loading.express ? 'loading' : ''}
        >
          {loading.express ? 'Testing...' : 'Test Express'}
        </button>

        <button 
          onClick={() => testEndpoint('mysql')} 
          disabled={loading.db}
          className={loading.db ? 'loading' : ''}
        >
          {loading.db ? 'Testing...' : 'Test Mysql'}
        </button>
        
        <button 
          onClick={() => testEndpoint('redis')} 
          disabled={loading.redis}
          className={loading.redis ? 'loading' : ''}
        >
          {loading.redis ? 'Testing...' : 'Test Redis'}
        </button>

        <button 
          onClick={() => testEndpoint('phpmyadmin')} 
          disabled={loading.phpmyadmin}
          className={loading.phpmyadmin ? 'loading' : ''}
        >
          {loading.phpmyadmin ? 'Testing...' : 'Test Phpmyadmin'}
        </button>

      </div>
      
      <div className="results-container">
        {Object.entries(results).map(([endpoint, result]) => (
          <div key={endpoint} className="result-card" style={{ fontSize: '18px' }}>
            <h3 style={{ fontSize: '24px' }}>Test: {endpoint.replace('-', ' ')}</h3>
            <p><strong>Time:</strong> {result.time}</p>
            <p><strong>Status:</strong> {result.status}</p>
            <pre style={{ fontSize: '16px' }}><strong>Response:</strong> {JSON.stringify(result.data, null, 2)}</pre>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;