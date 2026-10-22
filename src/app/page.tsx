'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Redirect to the vanilla Sonix app
    window.location.replace('/sonix/')
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '2rem',
      padding: '1rem',
      background: '#0a0a0f'
    }}>
      {/* Sonix Waveform Logo */}
      <div style={{
        width: '6rem',
        height: '6rem'
      }}>
        <img
          src="/favicon.svg"
          alt="Sonix AI - Music Generator"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          Sonix AI
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Professional AI Music Generator
        </p>
      </div>
      
      <div style={{
        padding: '0.75rem 1.5rem',
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '0.5rem',
        color: '#a78bfa',
        fontSize: '0.875rem'
      }}>
        Redirecting to Sonix...
      </div>
    </div>
  )
}
