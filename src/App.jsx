import { BrowserRouter } from 'react-router-dom'
import Pages from './Pages.jsx'


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Pages/>
      </BrowserRouter>
    </>
  )
}

export default App
