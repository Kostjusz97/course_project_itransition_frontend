import React from 'react';
import { Container, Form, Card, Button} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Navigate, NavLink } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { fetchAuth, selectIsAuth } from "../redux/slices/auth";

export const Auth = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch();

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid} ,
    setValue
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  });

  const onSubmit =  async (values) => {
    await dispatch(fetchAuth(values))
  }

  if (isAuth) {
    return <Navigate to="/" />
  };

  
    return (
      <Container 
        className="d-flex justify-content-center align-items-center"
        style={{height: window.innerHeight}}
      >
        <Card style={{width: 600}} className="p-5">
          <h2 className="m-auto"> Autorization</h2>
          <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
          <Form.Control
            className="mt-3"
            placeholder="Enter your email..."
            {...register('email')}
          />
          <Form.Control
            className="mt-3"
            placeholder="Enter your password..."
            {...register('password')}
            type="password"
          />
          
            <div className="d-flex justify-content-between mt-3 ">
              <div>
              Don't have account?<NavLink className={"ms-2"} to="/register">Create account</NavLink>
              </div>
              <Button
                variant={"outline-secondary"}
                type="submit"
              >
              Sign in
              </Button>
            </div>
            
          </Form>
        </Card>
      </Container>
    );
}


