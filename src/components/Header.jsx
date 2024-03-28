import React, { useEffect } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, Navigate, useNavigate} from 'react-router-dom';
import {Button, Container} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import { logout, selectIsAuth, fetchCheck  } from "../redux/slices/auth";
import { jwtDecode } from 'jwt-decode';
import { fetchOneCollection, myCollections } from '../redux/slices/collections';

export const Header = () => {
  const isAuth = useSelector(selectIsAuth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logOut = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate("/")
  }

  const handleUserPanelClick = () => {
    if (null) {
      dispatch(fetchOneCollection(null)); 
    }
    navigate('/user');
  }

  return (
    <Navbar bg="dark" >
      <Container>
        <NavLink className="ms-2"style={{color: 'white'}} to="/">Main</NavLink>
          {isAuth ?
          <Nav className="ms-auto" style={{color: 'white'}}> 
            <Button 
              variant="outline-light" 
              onClick={handleUserPanelClick}
            > 
              User Panel
            </Button>
            {/* <Button 
              variant="outline-light" 
              onClick={() => navigate("/user")}
            > 
              User Panel
            </Button> */}
            <Button 
              variant="outline-light ms-2" 
              onClick={() => logOut()}
              className="ml-2"
            >
              Sign out
              </Button>
          </Nav>
          :
          <Nav className="ms-auto" style={{color: 'white'}}> 
            <Button 
              variant="outline-light" 
              onClick={() => navigate("/login")}
            >
               Autorization
            </Button>
            <Button 
              variant="outline-light ms-2" 
              onClick={() => navigate("/register") }
            >
               Registration
            </Button>
          </Nav>
          }
      </Container>
    </Navbar>
  )
}
