import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const asset = (filename) => `${import.meta.env.BASE_URL}assets/${filename}`

const QUIZZES = [
  { phrase: 'no cap', options: ['No lie / for real', 'No hat allowed', 'Stop taking photos'], answer: 'No lie / for real' },
  { phrase: 'it’s giving', options: ['It has the vibe of…', 'Someone bought a gift', 'Please return it'], answer: 'It has the vibe of…' },
  { phrase: 'slay', options: ['You did amazing', 'Go to sleep', 'That was scary'], answer: 'You did amazing' },
  { phrase: 'lowkey', options: ['A little bit / secretly', 'Speak more quietly', 'I lost my keys'], answer: 'A little bit / secretly' },
  { phrase: 'bussin', options: ['Really, really good', 'Running late', 'Taking the bus'], answer: 'Really, really good' },
]

const FRIENDS = {
  friendOne: {
    message: 'Happy birthday Suthz!! I hope you’ve a great day today. I wish you all the happiness and love this world has to offer. Another trip around the sun is a massive milestone, and I hope you take a moment to look back and be proud of the person you have become. You’ll forever remain 16 in my eyes. Stay gen z and yolo life. I love you a lot!!',
    photos: [asset('chaya-1.jpg'), asset('chaya-2.jpg'), asset('chaya-3.jpg')],
  },
  friendTwo: {
    message: 'I feel like i say this alot and you may think it sounds like a broken record at this point but you are truly my sister.We have seen each other throught it all , Sutha .Its us against the world!You are at the core the most strong hearted person I know.I am so proud of ALL THAT you have acheieved and every time you chose to go over a hurdle.Happy Happy Birthday Sutha! I hope this year brings you as much joy and happiness as you bring to everyone around you. I love you so much and I am so grateful to have you in my life.',
    photos: [asset('shru-1.jpg'), asset('shru-2.jpg'), asset('shru-3.jpg')],
  },
}

// Replace these placeholders with the real birthday wishes.
const WISHES = [
  'I wish sutha so much happiness and good health this year!',
  'To feel free and able to do anything in the whole wild world!',
  'To get everything she’s been hoping for and more.',
  'To facetimes us more -_-',
  'for her to know how much she is loved and appreciated by everyone around her.',
  'Sutha deserves the world and I hope this year brings her as much joy as she brings to others.',
]

const KEY_LAYOUTS = [
  { friendOne: [-4.8, 0.35, 0.1], friendTwo: [4.8, 0.35, -2.1] },
  { friendOne: [-3.9, 0.35, -1.8], friendTwo: [4.5, 0.35, 0.2] },
  { friendOne: [-5.2, 0.35, -2.4], friendTwo: [3.6, 0.35, -0.6] },
]

const ZONES = [
  {
    id: 'friendOne',
    label: 'Chaya',
    color: '#9fc9f3',
    frameColors: ['#a9d4f7', '#ffe49a', '#c5def5'],
    photos: [
      { position: [-8.78, 4.7, -5.1], rotation: [0, Math.PI / 2, 0], size: [1.85, 2.25], layout: 'portrait' },
      { position: [-8.78, 4.7, -1.35], rotation: [0, Math.PI / 2, 0], size: [2.45, 1.8], layout: 'landscape' },
      { position: [-8.78, 4.7, 2.45], rotation: [0, Math.PI / 2, 0], size: [1.85, 2.25], layout: 'portrait' },
    ],
    messagePosition: [-2.75, 3.15, -6.72],
  },
  {
    id: 'friendTwo',
    label: 'Shru',
    color: '#f2cf68',
    frameColors: ['#ffe69b', '#a9d4f7', '#f6d97d'],
    photos: [
      { position: [-8.78, 1.9, -4.05], rotation: [0, Math.PI / 2, 0], size: [1.85, 2.25], layout: 'portrait' },
      { position: [-8.78, 1.9, -0.25], rotation: [0, Math.PI / 2, 0], size: [1.85, 2.25], layout: 'portrait' },
      { position: [-8.78, 1.9, 3.55], rotation: [0, Math.PI / 2, 0], size: [1.85, 2.25], layout: 'portrait' },
    ],
    messagePosition: [2.75, 3.15, -6.72],
  },
]

function randomItem(items, excludedItem) {
  const choices = excludedItem && items.length > 1 ? items.filter((item) => item !== excludedItem) : items
  return choices[Math.floor(Math.random() * choices.length)]
}

function createRandomQuiz(previousPhrase) {
  const quiz = randomItem(QUIZZES, QUIZZES.find((item) => item.phrase === previousPhrase))
  const options = [...quiz.options]

  for (let index = options.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[options[index], options[swapIndex]] = [options[swapIndex], options[index]]
  }

  return { ...quiz, options }
}

function QuizIntro({ quiz, onComplete }) {
  const [selected, setSelected] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const isCorrect = selected === quiz.answer

  function submitAnswer(event) {
    event.preventDefault()
    if (selected) setSubmitted(true)
  }

  return (
    <div className="quiz-overlay">
      <form className="quiz-card" onSubmit={submitAnswer}>
        <span className="eyebrow">Sutha’s birthday side quest</span>
        <div className="quiz-emoji" aria-hidden="true">✨</div>
        <h1>Quick vibe check</h1>
        <p className="quiz-prompt">What does <strong>“{quiz.phrase}”</strong> mean?</p>

        <div className="quiz-options" role="radiogroup" aria-label="Quiz answers">
          {quiz.options.map((option) => (
            <button
              className={`quiz-option ${selected === option ? 'selected' : ''}`}
              disabled={submitted}
              key={option}
              onClick={() => setSelected(option)}
              type="button"
            >
              <span>{option}</span>
              <span aria-hidden="true">{selected === option ? '●' : '○'}</span>
            </button>
          ))}
        </div>

        {!submitted ? (
          <button className="primary-button" disabled={!selected} type="submit">Lock in answer</button>
        ) : (
          <div className={`quiz-result ${isCorrect ? 'correct' : 'wrong'}`} role="status">
            <p>
              {isCorrect
                ? 'Okayyy Sutha, the Gen Z knowledge is showing.'
                : `No cap, the answer was “${quiz.answer}”. We’ll allow it.`}
            </p>
            <button className="primary-button" onClick={onComplete} type="button">Enter the room →</button>
          </div>
        )}
      </form>
    </div>
  )
}

function Balloon({ color, position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow scale={[0.72, 0.9, 0.72]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.55, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.11, 0.22, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

function LavenderPlant({ position, scale = 1 }) {
  const stems = [-0.3, -0.12, 0.08, 0.28]
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.42, 0.32, 0.65, 20]} />
        <meshStandardMaterial color="#efe7dc" roughness={0.9} />
      </mesh>
      {stems.map((x, index) => (
        <group key={x} position={[x, 0.95 + (index % 2) * 0.12, 0]}>
          <mesh>
            <cylinderGeometry args={[0.025, 0.025, 0.8, 8]} />
            <meshStandardMaterial color="#5e966d" />
          </mesh>
          <mesh position={[0, 0.42, 0]} scale={[0.13, 0.34, 0.13]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={index % 2 ? '#8f6dcc' : '#aa83df'} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Bench({ position }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[3, 0.22, 0.8]} />
        <meshStandardMaterial color="#c98f68" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0, 1.35, 0.34]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[3, 0.9, 0.16]} />
        <meshStandardMaterial color="#d69b72" roughness={0.85} />
      </mesh>
      {[-1.15, 1.15].map((x) => (
        <React.Fragment key={x}>
          <mesh castShadow position={[x, 0.35, 0]}>
            <boxGeometry args={[0.14, 0.75, 0.14]} />
            <meshStandardMaterial color="#6c7183" metalness={0.2} />
          </mesh>
          <mesh castShadow position={[x, 0.8, 0.38]}>
            <boxGeometry args={[0.14, 1.2, 0.14]} />
            <meshStandardMaterial color="#6c7183" metalness={0.2} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  )
}

function Gift({ color, position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[0.9, 0.82, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      <mesh castShadow position={[0, 0.43, 0.46]}>
        <boxGeometry args={[0.18, 0.86, 0.04]} />
        <meshStandardMaterial color="#fff4bd" />
      </mesh>
      <mesh castShadow position={[0, 0.43, 0]}>
        <boxGeometry args={[0.18, 0.86, 0.94]} />
        <meshStandardMaterial color="#fff4bd" />
      </mesh>
      <mesh castShadow position={[0, 0.87, 0]}>
        <torusGeometry args={[0.2, 0.06, 10, 20]} />
        <meshStandardMaterial color="#fff4bd" />
      </mesh>
    </group>
  )
}

function SideTable({ position }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.12, 24]} />
        <meshStandardMaterial color="#cf9c73" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.72, 16]} />
        <meshStandardMaterial color="#8196aa" />
      </mesh>
    </group>
  )
}

function Passport({ position }) {
  return (
    <group position={position} rotation={[0, -0.2, 0.03]}>
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.035, 0.48]} />
        <meshStandardMaterial color="#a92f36" roughness={0.78} />
      </mesh>
      <Html center position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]} transform>
        <div className="passport-cover">PASSPORT<br /><span>✦</span></div>
      </Html>
    </group>
  )
}

function UniqloSign({ position }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 1.45, 0]}>
        <boxGeometry args={[1.35, 1.35, 0.14]} />
        <meshStandardMaterial color="#f5f1df" roughness={0.7} />
      </mesh>
      <Html center position={[0, 1.45, 0.09]} transform>
        <div className="uniqlo-logo">
          <span>UNI</span>
          <span>QLO</span>
        </div>
      </Html>
      <mesh castShadow position={[0, 0.68, 0]}>
        <boxGeometry args={[0.12, 0.9, 0.12]} />
        <meshStandardMaterial color="#7799b6" metalness={0.25} />
      </mesh>
      <mesh castShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[1.15, 0.12, 0.72]} />
        <meshStandardMaterial color="#7799b6" metalness={0.25} />
      </mesh>
    </group>
  )
}

function VinylCorner({ position }) {
  const records = [
    { artist: 'GRACIE', color: '#b6d9f2', image: asset('gracie-abrams.jpg'), rotation: -0.12 },
    { artist: 'TAYLOR', color: '#f4d978', image: asset('taylor-swift.jpg'), rotation: 0.04 },
    { artist: 'BTS', color: '#d3e7f7', image: asset('bts.jpg'), rotation: 0.14 },
  ]

  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.48, 0]}>
        <boxGeometry args={[2.5, 0.9, 0.75]} />
        <meshStandardMaterial color="#d5a878" roughness={0.85} />
      </mesh>
      <Html center position={[0, 0.48, 0.43]} transform>
        <div className="vinyl-heading">SUTHA’S VINYL CORNER</div>
      </Html>
      {records.map((record, index) => (
        <group
          key={record.artist}
          position={[(index - 1) * 0.72, 1.5, 0]}
          rotation={[0, 0, record.rotation]}
        >
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.65, 0.08]} />
            <meshStandardMaterial color={record.color} roughness={0.75} />
          </mesh>
          <Html center position={[0, 0, 0.06]} transform>
            <div className="vinyl-image">
              <span>{record.artist.slice(0, 1)}</span>
              <img
                alt={`${record.artist} vinyl artwork`}
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
                src={record.image}
              />
            </div>
          </Html>
          <Html center position={[0, -0.7, 0.08]} transform>
            <div className="vinyl-artist">{record.artist}</div>
          </Html>
        </group>
      ))}
    </group>
  )
}

function Netball({ position }) {
  return (
    <group position={position}>
      <mesh castShadow rotation={[0.35, 0.25, -0.2]}>
        <sphereGeometry args={[0.48, 28, 28]} />
        <meshStandardMaterial color="#fff7d0" roughness={0.75} />
      </mesh>
      <Html center position={[0, 0, 0.5]} transform>
        <div className="netball-mark">NET<br />BALL</div>
      </Html>
    </group>
  )
}

function MiniBicycle({ position }) {
  return (
    <group position={position} rotation={[0, -0.35, 0]} scale={0.8}>
      {[-0.7, 0.7].map((x) => (
        <mesh castShadow key={x} position={[x, 0.55, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.45, 0.06, 12, 28]} />
          <meshStandardMaterial color="#547d9f" metalness={0.35} roughness={0.4} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 0.68, 0]} rotation={[0, 0, -0.18]}>
        <cylinderGeometry args={[0.045, 0.045, 1.45, 8]} />
        <meshStandardMaterial color="#f0ca58" metalness={0.25} />
      </mesh>
      <mesh castShadow position={[-0.35, 0.82, 0]} rotation={[0, 0, 0.75]}>
        <cylinderGeometry args={[0.045, 0.045, 0.85, 8]} />
        <meshStandardMaterial color="#f0ca58" metalness={0.25} />
      </mesh>
      <mesh castShadow position={[0.35, 0.82, 0]} rotation={[0, 0, -0.75]}>
        <cylinderGeometry args={[0.045, 0.045, 0.85, 8]} />
        <meshStandardMaterial color="#f0ca58" metalness={0.25} />
      </mesh>
      <mesh castShadow position={[0.15, 1.12, 0]}>
        <boxGeometry args={[0.42, 0.08, 0.2]} />
        <meshStandardMaterial color="#43637f" />
      </mesh>
      <mesh castShadow position={[0.72, 1.1, 0]} rotation={[0, 0, -0.28]}>
        <cylinderGeometry args={[0.035, 0.035, 0.62, 8]} />
        <meshStandardMaterial color="#547d9f" metalness={0.35} />
      </mesh>
    </group>
  )
}

function GenkiSign({ position, rotation = [0, 0, 0] }) {
  return (
    <Html center position={position} rotation={rotation} transform>
      <div className="genki-sign">
        <span>元気</span>
        <strong>GENKI SUSHI</strong>
      </div>
    </Html>
  )
}

function WorldMapPoster({ position, rotation = [0, 0, 0] }) {
  return (
    <Html center position={position} rotation={rotation} transform>
      <div className="world-map-poster">
        <strong>THE WORLD AWAITS</strong>
        <div className="world-map-art" aria-hidden="true">
          <span className="continent america" />
          <span className="continent europe" />
          <span className="continent asia" />
          <span className="continent africa" />
          <span className="continent australia" />
          <i className="map-route">✈</i>
        </div>
      </div>
    </Html>
  )
}

const MOBILE_VIEWS = {
  room: {
    camera: [0, 6.2, 19.5],
    target: [0, 2.2, -1],
  },
  photos: {
    camera: [-4.2, 3.8, 1.1],
    target: [-8.7, 3.55, -1.55],
  },
  messages: {
    camera: [0, 4, 4.7],
    target: [0, 3.25, -6.7],
  },
  wishes: {
    camera: [4, 3.9, 0.1],
    target: [8.7, 3.3, -2.35],
  },
  keys: {
    camera: [0, 8.6, 8.2],
    target: [0, 0, 1],
  },
}

function Rug() {
  return (
    <mesh receiveShadow position={[0, 0.015, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[3.6, 48]} />
      <meshStandardMaterial color="#d8eafa" roughness={1} />
    </mesh>
  )
}

function WishesWall() {
  const postIts = [
    { position: [8.76, 4.15, -4.95], color: '#fff0a8', rotation: -2 },
    { position: [8.76, 4.15, -2.35], color: '#d9edff', rotation: 2 },
    { position: [8.76, 4.15, 0.25], color: '#fff5c9', rotation: -2 },
    { position: [8.76, 2.25, -4.95], color: '#cde6fb', rotation: 2 },
    { position: [8.76, 2.25, -2.35], color: '#ffe8a3', rotation: -2 },
    { position: [8.76, 2.25, 0.25], color: '#e5f2ff', rotation: 2 },
  ]

  return (
    <group>
      <Html center position={[8.72, 5.55, -2.35]} rotation={[0, -Math.PI / 2, 0]} transform>
        <div className="wishes-sign">WISHES FOR SUTHA ✦</div>
      </Html>
      {postIts.map((note, index) => (
        <Html
          center
          key={WISHES[index]}
          position={note.position}
          rotation={[0, -Math.PI / 2, 0]}
          transform
        >
          <div
            className="wish-note"
            style={{ background: note.color, transform: `rotate(${note.rotation}deg)` }}
          >
            <span>{WISHES[index]}</span>
          </div>
        </Html>
      ))}
    </group>
  )
}

function BirthdayCake() {
  return (
    <group position={[0, 0, 3.25]}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.18, 32]} />
        <meshStandardMaterial color="#d9b28d" />
      </mesh>
      <mesh castShadow position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.72, 0.8, 0.82, 32]} />
        <meshStandardMaterial color="#f5bad3" />
      </mesh>
      <mesh castShadow position={[0, 1.48, 0]}>
        <cylinderGeometry args={[0.74, 0.74, 0.1, 32]} />
        <meshStandardMaterial color="#fff1d4" />
      </mesh>
      <Html center position={[0, 2.05, 0]} transform>
        <div className="cake-number">28</div>
      </Html>
      <Html center position={[0, 0.15, 1]} transform>
        <div className="cake-label">Make a wish, Sutha! 🎂</div>
      </Html>
    </group>
  )
}

function RoomShell() {
  return (
    <>
      <color attach="background" args={['#eaf4ff']} />
      <fog attach="fog" args={['#eaf4ff', 20, 34]} />
      <ambientLight intensity={1.35} />
      <directionalLight castShadow intensity={1.7} position={[5, 10, 7]} />
      <pointLight color="#fff0b3" intensity={1.7} position={[-7, 4, 1]} />
      <pointLight color="#d8eaff" intensity={1.7} position={[7, 4, 1]} />

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#fff9dc" />
      </mesh>
      <mesh position={[0, 3.25, -7]} receiveShadow>
        <boxGeometry args={[18, 6.5, 0.3]} />
        <meshStandardMaterial color="#dceaff" />
      </mesh>
      <mesh position={[-9, 3.25, 0]} receiveShadow>
        <boxGeometry args={[0.3, 6.5, 14]} />
        <meshStandardMaterial color="#fff1bd" />
      </mesh>
      <mesh position={[9, 3.25, 0]} receiveShadow>
        <boxGeometry args={[0.3, 6.5, 14]} />
        <meshStandardMaterial color="#dcecff" />
      </mesh>

      <Html center position={[0, 5.85, -6.78]} transform>
        <div className="birthday-banner">HAPPY 28TH SUTHA ✦</div>
      </Html>

      <Html center position={[0, 6.25, -6.75]} transform>
        <div className="party-garland">● ✦ ● ✦ ● ✦ ● ✦ ●</div>
      </Html>

      <Rug />
      <Bench position={[6.9, 0, 4.35]} />
      <SideTable position={[5.05, 0, 4.25]} />
      <Passport position={[5.05, 0.83, 4.25]} />
      <LavenderPlant position={[-7.3, 0, -5.5]} />
      <LavenderPlant position={[8, 0, 5.65]} scale={0.9} />
      <LavenderPlant position={[-4.65, 0, 5.75]} scale={0.78} />
      <BirthdayCake />
      <Gift color="#9ecbf0" position={[-2.2, 0, 3]} scale={0.85} />
      <Gift color="#f5d675" position={[-1.25, 0, 2.65]} scale={0.65} />
      <Gift color="#b9d9f2" position={[2.15, 0, 2.85]} scale={0.72} />
      <WishesWall />
      <VinylCorner position={[-7, 0, 5.1]} />
      <UniqloSign position={[7.15, 0, -5.65]} />
      <Netball position={[6.5, 0.5, 1.35]} />
      <MiniBicycle position={[-5.9, 0, 3.65]} />
      <GenkiSign position={[8.76, 4.8, 3.9]} rotation={[0, -Math.PI / 2, 0]} />
      <WorldMapPoster position={[8.76, 2.95, 3.9]} rotation={[0, -Math.PI / 2, 0]} />

      <Balloon color="#ffe08a" position={[-7.2, 4.9, -5.8]} />
      <Balloon color="#a9d4f7" position={[7.1, 5.1, -5.8]} />
      <Balloon color="#d4e9fb" position={[7.8, 4.25, -5.4]} scale={0.85} />
      <Balloon color="#fff0ae" position={[-8, 4.2, 3.8]} scale={0.8} />
      <Balloon color="#b9dcf7" position={[8.1, 4.8, 3.4]} scale={0.8} />
    </>
  )
}

function KeyObject({ color, collected, label, onCollect, position }) {
  if (collected) return null

  return (
    <group position={position}>
      <mesh position={[0, -0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.55, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.62} />
      </mesh>
      <pointLight color={color} intensity={0.8} distance={2.2} position={[0, 0.35, 0]} />
      <group rotation={[0, 0.35, -0.18]}>
      <mesh
        onClick={(event) => {
          event.stopPropagation()
          onCollect()
        }}
      >
        <sphereGeometry args={[0.65, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh castShadow>
        <torusGeometry args={[0.14, 0.05, 12, 24]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[0.24, 0, 0]}>
        <boxGeometry args={[0.36, 0.06, 0.06]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[0.39, -0.08, 0]}>
        <boxGeometry args={[0.06, 0.17, 0.06]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.2} />
      </mesh>
      <Html center position={[0.15, 0.46, 0]} distanceFactor={3}>
        <button className="key-label" onClick={onCollect} type="button">🔑 {label}</button>
      </Html>
      </group>
    </group>
  )
}

function FriendMessage({ color, label, message, position, unlocked }) {
  return (
    <Html center position={position} transform>
      <div className={`friend-message ${unlocked ? 'unlocked' : ''}`}>
        <span className="locked-icon" style={{ background: color }}>{unlocked ? '💌' : '🔒'}</span>
        <strong>{label}’s message</strong>
        <p>{unlocked ? message : `Find ${label}’s key to unlock this message.`}</p>
      </div>
    </Html>
  )
}

function WallPhoto({ color, image, layout, position, rotation, size }) {
  const texture = useLoader(THREE.TextureLoader, image)
  const { gl } = useThree()
  const imageRatio = layout === 'landscape' ? 4 / 3 : 3 / 4
  const availableWidth = size[0] - 0.18
  const availableHeight = size[1] - 0.18
  const availableRatio = availableWidth / availableHeight
  const photoWidth = imageRatio > availableRatio
    ? availableWidth
    : availableHeight * imageRatio
  const photoHeight = imageRatio > availableRatio
    ? availableWidth / imageRatio
    : availableHeight

  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = gl.capabilities.getMaxAnisotropy()
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow position={[0, 0, 0.02]}>
        <boxGeometry args={[size[0], size[1], 0.13]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.095]}>
        <planeGeometry args={[photoWidth, photoHeight]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}

function PlayerController({ view }) {
  const controls = useRef()
  const { camera } = useThree()
  const desiredCamera = useRef(new THREE.Vector3())
  const desiredTarget = useRef(new THREE.Vector3())
  const previousView = useRef(view)
  const movingToPreset = useRef(false)

  useFrame(() => {
    if (!controls.current) return

    if (previousView.current !== view) {
      previousView.current = view
      movingToPreset.current = true
    }

    if (!movingToPreset.current) return

    const preset = MOBILE_VIEWS[view]
    desiredCamera.current.fromArray(preset.camera)
    desiredTarget.current.fromArray(preset.target)

    camera.position.lerp(desiredCamera.current, 0.12)
    controls.current.target.lerp(desiredTarget.current, 0.12)
    controls.current.update()

    if (
      camera.position.distanceToSquared(desiredCamera.current) < 0.015
      && controls.current.target.distanceToSquared(desiredTarget.current) < 0.015
    ) {
      movingToPreset.current = false
    }
  })

  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableRotate
      enableZoom
      maxDistance={18}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={4}
      minPolarAngle={Math.PI / 3.5}
      rotateSpeed={0.55}
      zoomSpeed={0.75}
      target={MOBILE_VIEWS.room.target}
    />
  )
}

function MemoryRoom({ challenge, collected, onCollect, view }) {
  return (
    <Canvas camera={{ fov: 58, position: MOBILE_VIEWS.room.camera }} shadows>
      <RoomShell />
      {ZONES.map((zone) => (
        <React.Fragment key={zone.id}>
          <KeyObject
            collected={collected[zone.id]}
            color={zone.color}
            label={zone.label}
            onCollect={() => onCollect(zone.id)}
            position={challenge[zone.id]}
          />
          {FRIENDS[zone.id].photos.map((image, index) => (
            <WallPhoto
              color={zone.frameColors[index]}
              image={image}
              key={`${zone.id}-${index}`}
              layout={zone.photos[index].layout}
              position={zone.photos[index].position}
              rotation={zone.photos[index].rotation}
              size={zone.photos[index].size}
            />
          ))}
          <FriendMessage
            color={zone.color}
            label={zone.label}
            message={FRIENDS[zone.id].message}
            position={zone.messagePosition}
            unlocked={collected[zone.id]}
          />
        </React.Fragment>
      ))}
      <PlayerController view={view} />
    </Canvas>
  )
}

function PhoneNavigation({ activeView, onChange }) {
  const views = [
    ['room', '🏠', 'Room'],
    ['photos', '🖼️', 'Photos'],
    ['messages', '💌', 'Messages'],
    ['wishes', '📝', 'Wishes'],
    ['keys', '🔑', 'Keys'],
  ]

  return (
    <nav className="phone-navigation" aria-label="Birthday room views">
      {views.map(([id, icon, label]) => (
        <button
          className={activeView === id ? 'active' : ''}
          key={id}
          onClick={() => onChange(id)}
          type="button"
        >
          <span aria-hidden="true">{icon}</span>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  )
}

export default function Room() {
  const [quiz] = useState(() => createRandomQuiz())
  const [challenge] = useState(() => randomItem(KEY_LAYOUTS))
  const [stage, setStage] = useState('quiz')
  const [collected, setCollected] = useState({ friendOne: false, friendTwo: false })
  const [view, setView] = useState('room')

  const keysFound = Object.values(collected).filter(Boolean).length

  function collectKey(zone) {
    setCollected((current) => ({ ...current, [zone]: true }))
  }

  function changeView(nextView) {
    setView(nextView)
  }

  return (
    <main className="room-root">
      {stage === 'quiz' && <QuizIntro key={quiz.phrase} onComplete={() => setStage('room')} quiz={quiz} />}

      {stage === 'room' && (
        <>
          <MemoryRoom
            challenge={challenge}
            collected={collected}
            onCollect={collectKey}
            view={view}
          />
          <section className="room-hud" aria-live="polite">
            <div className="hud-copy">
              <span className="eyebrow">Birthday room challenge</span>
              <h1>Find two keys to unlock both messages</h1>
            </div>
            <div className="progress-row">
              <span>🔑 {keysFound}/2 keys</span>
              <span>💌 {keysFound}/2 messages</span>
            </div>
            {keysFound === 2 && (
              <button className="finish-button" onClick={() => setStage('final')} type="button">
                Finish
              </button>
            )}
          </section>
          <PhoneNavigation
            activeView={view}
            onChange={changeView}
          />
        </>
      )}

      {stage === 'final' && (
        <div className="final-modal">
          <div className="final-card">
            <div className="final-confetti" aria-hidden="true">🎉 ✨ 🎂 ✨ 🎉</div>
            <span className="eyebrow">Both messages unlocked</span>
            <h1>Happy 28th, Sutha!</h1>
            <p>You found both friends’ keys and unlocked their special messages.</p>
            <p className="final-message">You are deeply loved, loudly celebrated, and absolutely the main character today.</p>
            <p className="stay-question">Would you like to sit in the room for a while?</p>
            <button className="primary-button" onClick={() => setStage('room')} type="button">
              Stay in the birthday room
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
