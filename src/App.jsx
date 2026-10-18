import { useEffect, useState } from 'react'
import { Experience } from './components/Experience'
import './App.css'
import { Canvas } from '@react-three/fiber'

function App() {
  const [hasModel, setHasModel] = useState(null)

  useEffect(() => {
    let active = true

    fetch('/model/knight.glb', { method: 'HEAD' })
      .then((response) => {
        if (active) {
          setHasModel(response.ok && Number(response.headers.get('content-length')) > 0)
        }
      })
      .catch(() => {
        if (active) setHasModel(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <>
      {hasModel === false ? (
        <main className="model-error">
          <p>Model file is empty. Replace public/model/knight.glb with your GLB file.</p>
        </main>
      ) : hasModel === true ? (
        <Canvas
  shadows
  camera={{
    position: [5, 4, 8],
    fov: 80,
  }}
>
  <Experience />
</Canvas>
      ) : null}
    </>
  )
}

export default App