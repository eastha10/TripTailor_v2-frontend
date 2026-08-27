import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import './styles/shared.css'
import './styles/home.css'
import './styles/planner.css'
import './styles/auth.css'
import './styles/survey.css'
import './styles/share.css'
import './styles/workspace.css'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
