import React, { useState } from 'react'
import Room from './Room'

export default function App() {
  const [started, setStarted] = useState(false)

  return (
    <div className="app-root">
      {!started ? (
        <div className="enter-screen">
          <h1>Happy Birthday Sutha 🎉</h1>
          <p className="lead">
            A tiny birthday quest filled with room keys, floating memories, and main-character energy.
          </p>
          <button className="enter-btn" onClick={() => setStarted(true)} type="button">
            Start the surprise ✨
          </button>
        </div>
      ) : (
        <Room />
      )}
    </div>
  )
}
