'use client'

import { useEffect } from 'react'

export default function Home() {
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
      <div style={{ width: '6rem', height: '6rem' }}>
        <img
          src="/favicon.svg"
          alt="Sonix AI - Music Generator"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          Sonix AI
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Professional AI Music Generator
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <a 
          href="#/login" 
          style={{
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            color: 'white',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1rem'
          }}
        >
          🎵 Get Started
        </a>
        <a 
          href="#/dashboard" 
          style={{
            padding: '0.75rem 2rem',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            color: '#a78bfa',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          Dashboard
        </a>
      </div>

      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '1rem',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>✨ 5 Generation Modes</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem', color: '#9ca3af', fontSize: '0.85rem' }}>
          <div style={{ padding: '0.5rem', background: 'rgba(139,92,246,0.1)', borderRadius: '0.5rem' }}>🎤 Simple</div>
          <div style={{ padding: '0.5rem', background: 'rgba(6,182,212,0.1)', borderRadius: '0.5rem' }}>⚙️ Custom</div>
          <div style={{ padding: '0.5rem', background: 'rgba(255,107,53,0.1)', borderRadius: '0.5rem' }}>🎛️ Studio</div>
          <div style={{ padding: '0.5rem', background: 'rgba(168,85,247,0.1)', borderRadius: '0.5rem' }}>🎼 Composer</div>
          <div style={{ padding: '0.5rem', background: 'rgba(6,182,212,0.1)', borderRadius: '0.5rem' }}>🔊 Sound Design</div>
        </div>
      </div>
    </div>
  )
}
