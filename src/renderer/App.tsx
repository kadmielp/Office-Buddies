import './App.css'
import { Clippy } from './Clippy'
export function App() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      width: '100%',
      height: '100%'
    }}>
      <Clippy />
    </div>
  )
}
