import './App.css'
import { Outlet, Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar'

const App = () => {
  const user = {}
  return (
    <Routes>
      <Route path="/" element={<><NavBar/><Outlet/></>}>
        <Route index element={
          user ? <>Login</> : <>Dashboard</>
        }/>
        <Route path="clubs">
          <Route index element={<></>}/>
          <Route path=":clubId" element={<></>}/>
          <Route path=":userId" element={<></>}/>
        </Route>
        <Route path="library/:userId">
          <Route index element={<></>}/>
        </Route>
        <Route path="books" element={<>Books</>}>
          <Route path="bookId" element={<>Book</>}/>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
