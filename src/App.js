import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import './App.css';
import { Main, Auth, Registration, User, Collection, Item, Admin } from './pages';
import { Header } from './components/Header';

function App() {
  const dispatch = useDispatch()

  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/login" element={<Auth/>}/>
        <Route path="/register" element={<Registration/>}/>
        <Route path="/user" element={<User/>}/>
        <Route path="/collection/:id" element={<Collection/>}/>
        <Route path="/item/:id" element={<Item/>}/>
        <Route path="/admin" element={<Admin/>}/>
      </Routes>
    </>
  );
}

export default App;
