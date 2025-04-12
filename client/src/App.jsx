import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import BlogList from './pages/BlogList'
import BlogView from './pages/BlogView'
import BlogEditor from './pages/BlogEditor'
import About from './pages/About'
import Projects from './pages/Projects'
import Experience from './pages/Experience'
import Skills from './pages/Skills'
import BlogDetail from './pages/BlogDetail'
import ChatPage from './pages/ChatPage'

const App = () => {
  return (
    <Routes>
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/experience" element={<Experience />} />
      <Route path='/skills' element={<Skills />} />
      <Route path="/" element={<BlogList />} />
      <Route path="/blog/:id" element={<BlogView />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      <Route path="/editor" element={<BlogEditor />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/chat" element={<ChatPage />} />

    </Routes>
  )
}

export default App