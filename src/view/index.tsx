import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

export const init = () => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
}