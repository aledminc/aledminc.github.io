import { Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Schedule from './pages/Schedule.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/schedule" element={<Schedule />} />
        {/* unknown -> home */}
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
