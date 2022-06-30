import { useState } from 'react'
import './App.css'
import { Clock } from './components/Clock'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div id="app-div">
      <Clock />
    </div>
  )
}

export default App
