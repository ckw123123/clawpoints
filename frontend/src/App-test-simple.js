import React from 'react';

// Ultra-simple test app to isolate the issue
const App = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
          ClawPoints Test
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Ultra-simple test version
        </p>
        
        <div style={{ marginBottom: '1rem' }}>
          <button style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '0.5rem'
          }}>
            Test Button 1
          </button>
          
          <button style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Test Button 2
          </button>
        </div>
        
        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: '6px',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <p style={{ color: '#166534', fontSize: '0.875rem', margin: 0 }}>
            ✅ If you can see this, React is working properly!
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;