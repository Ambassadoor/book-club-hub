import './App.css'
import { Outlet, Route, Routes } from 'react-router-dom'

const App = () => {
  const user = {}
  return (
    <Routes>
      <Route path="/" element={<><Outlet/></>}>
        <Route index element={
          user ? <>Login</> : <>Dashboard</>
        }/>
        <Route path="clubs">
          <Route index element={<></>}/>
          <Route path=":clubId" element={<></>}/>
          <Route path=":userId" element={<></>}/>
          <Route path="newClub" element={<>NewClubForm</>}/>
          <Route path="deleteClub" element={<>Club Delete</>}/>
        </Route>
        <Route path="library/userId">
          <Route index element={<></>}/>
        </Route>
        <Route path="book:bookId" element={<>Book</>}/>
      </Route>
    </Routes>
  )
}

export default App
