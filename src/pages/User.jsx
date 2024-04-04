import React, { useEffect, useState } from 'react';
import { Container, Col, Row, Button, Table, Modal, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { fetchMyCollections, myCollections } from '../redux/slices/collections';
import { jwtDecode } from "jwt-decode";
import axios from '../axios';
import {useDispatch, useSelector} from 'react-redux';

export const User = () => {
  
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const collections = useSelector(myCollections)
    
    const [selectedCollection, setSelectedCollection] = useState(null);
    const initialValues = selectedCollection || {};

    const { 
      register, 
      handleSubmit,
      watch,
      setValue,
      reset
    } = useForm({
      defaultValues: {
        user_id: initialValues.user_id || '',
        category_id: initialValues.category_id || '',
        name: initialValues.name || '', 
        description: initialValues.description || '', 
        image_url: initialValues.image_url || '',
        custom_int1_state: initialValues.custom_int1_state || false,
        custom_int1_name: initialValues.custom_int1_name || '',
        custom_int2_state: initialValues.custom_int2_state || false,
        custom_int2_name: initialValues.custom_int2_name || '',
        custom_int3_state: initialValues.custom_int3_state || false,
        custom_int3_name: initialValues.custom_int3_name || '',
        custom_string1_state: initialValues.custom_string1_state || false,
        custom_string1_name: initialValues.custom_string1_name || '',
        custom_string2_state: initialValues.custom_string2_state || false,
        custom_string2_name: initialValues.custom_string2_name || '',
        custom_string3_state: initialValues.custom_string3_state || false,
        custom_string3_name: initialValues.custom_string3_name || '',
        custom_text1_state: initialValues.custom_text1_state || false,
        custom_text1_name: initialValues.custom_text1_name || '',
        custom_text2_state: initialValues.custom_text2_state || false,
        custom_text2_name: initialValues.custom_text2_name || '',
        custom_text3_state: initialValues.custom_text3_state || false,
        custom_text3_name: initialValues.custom_text3_name || '',
        custom_boolean1_state: initialValues.custom_boolean1_state || false,
        custom_boolean1_name: initialValues.custom_boolean1_name || '',
        custom_boolean2_state: initialValues.custom_boolean2_state || false,
        custom_boolean2_name: initialValues.custom_boolean2_name || '',
        custom_boolean3_state: initialValues.custom_boolean3_state || false,
        custom_boolean3_name: initialValues.custom_boolean3_name || '',
        custom_date1_state: initialValues.custom_date1_state || false,
        custom_date1_name: initialValues.custom_date1_name || '',
        custom_date2_state: initialValues.custom_date2_state || false,
        custom_date2_name: initialValues.custom_date2_name || '',
        custom_date3_state: initialValues.custom_date3_state || false,
        custom_date3_name: initialValues.custom_date3_name || '',
      },
      mode: 'onChange'
    });

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) { 
        const decodedToken = jwtDecode(token);
        setValue('user_id', decodedToken.id);
        dispatch(fetchMyCollections(decodedToken.id))        
      }         
    }, []);

    useEffect(() => {
      if (selectedCollection) {
        Object.keys(selectedCollection).forEach(key => {
          setValue(key, selectedCollection[key]);
        });
      }
    }, [selectedCollection, setValue]);
    
    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedCollection(null);
      reset()
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      setValue('user_id', decodedToken.id);
    };

    const handleShowModal = (collection = null) => {
      setSelectedCollection(collection);
      setShowModal(true);
    };

    const handleCreateCollection = (data) => {
        console.log(data)
        data.category_id = null;
        axios.post('/api/collection/create', data);
        dispatch(fetchMyCollections(data.user_id)) 
        setShowModal(false);
        setSelectedCollection(null)
    };

    const handleEditCollection = (data) => {
      const collectionId = selectedCollection.id;
      const userId = selectedCollection.user_id;
      axios.patch(`/api/collection/update/${collectionId}`, data);
      dispatch(fetchMyCollections(userId)) 
      setShowModal(false);
      setSelectedCollection(null)
      
    };    

    const handleDeleteCollection = (data) => {
      const collectionId = data.id;      
      const userId = data.user_id
      axios.delete(`/api/collection/remove/${collectionId}`, data);
      dispatch(fetchMyCollections(userId))
    };

    return (
      <Container className="mt-3">
        <Row>
          <Col className="d-flex justify-content-between align-items-center">
            <h2>My collections</h2>
            <Button 
              variant={"outline-dark"} 
              size="sm"
              onClick={() => handleShowModal()}>Add new Collection</Button>
          </Col>
        </Row>
        <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedCollection ? 'Edit Collection' : 'Create New Collection'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(selectedCollection ? handleEditCollection : handleCreateCollection)}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" {...register("name", { required: true })} />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter description" {...register("description", { required: true })} />
                        </Form.Group>
                        <Form.Group controlId="formImageUrl">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" placeholder="Enter image URL" {...register("image_url")} />
                        </Form.Group>
                        <Form.Group controlId="formCustomFields">
                          <Form.Label>Custom Fields (INTEGER)</Form.Label>
                          <Form.Check type="checkbox" label="Field 1" {...register("custom_int1_state")} />
                            {watch("custom_int1_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_int1_name")} />}
  
                          <Form.Check type="checkbox" label="Field 2" {...register("custom_int2_state")} />
                            {watch("custom_int2_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_int2_name")} />}
  
                          <Form.Check type="checkbox" label="Field 3" {...register("custom_int3_state")} />
                            {watch("custom_int3_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_int3_name")} />}
                        </Form.Group>

                        <Form.Group controlId="formCustomFields">
                          <Form.Label>Custom Fields (STRING)</Form.Label>
                          <Form.Check type="checkbox" label="Field 1" {...register("custom_string1_state")} />
                            {watch("custom_string1_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_string1_name")} />}
  
                          <Form.Check type="checkbox" label="Field 2" {...register("custom_string2_state")} />
                            {watch("custom_string2_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_string2_name")} />}
  
                          <Form.Check type="checkbox" label="Field 3" {...register("custom_string3_state")} />
                            {watch("custom_string3_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_string3_name")} />}
                        </Form.Group>

                        <Form.Group controlId="formCustomFields">
                          <Form.Label>Custom Fields (TEXT)</Form.Label>
                          <Form.Check type="checkbox" label="Field 1" {...register("custom_text1_state")} />
                            {watch("custom_text1_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_text1_name")} />}
  
                          <Form.Check type="checkbox" label="Field 2" {...register("custom_text2_state")} />
                            {watch("custom_text2_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_text2_name")} />}
  
                          <Form.Check type="checkbox" label="Field 3" {...register("custom_text3_state")} />
                            {watch("custom_text3_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_text3_name")} />}
                        </Form.Group>

                        <Form.Group controlId="formCustomFields">
                          <Form.Label>Custom Fields (BOOLEAN)</Form.Label>
                          <Form.Check type="checkbox" label="Field 1" {...register("custom_boolean1_state")} />
                            {watch("custom_boolean1_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_boolean1_name")} />}
  
                          <Form.Check type="checkbox" label="Field 2" {...register("custom_boolean2_state")} />
                            {watch("custom_boolean2_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_boolean2_name")} />}
  
                          <Form.Check type="checkbox" label="Field 3" {...register("custom_boolean3_state")} />
                            {watch("custom_boolean3_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_boolean3_name")} />}
                        </Form.Group>

                        <Form.Group controlId="formCustomFields">
                          <Form.Label>Custom Fields (DATE)</Form.Label>
                          <Form.Check type="checkbox" label="Field 1" {...register("custom_date1_state")} />
                            {watch("custom_date1_state") && <Form.Control type="text" placeholder="Enter name" {...register("custom_date1_name")} />}
  
                          <Form.Check type="checkbox" label="Field 2" {...register("custom_date2_state")} />
                            {watch("custom_date2_state") && 
                              <Form.Control type="text" placeholder="Enter name" {...register("custom_date2_name")} />}
  
                          <Form.Check type="checkbox" label="Field 3" {...register("custom_date3_state")} />
                            {watch("custom_date3_state") && <Form.Control type="text" placeholder="Enter name" {...register("custom_date3_name")} />}
                        </Form.Group>

                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                          <Button variant="primary" type="submit">{selectedCollection ? 'Edit' : 'Create'}</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        <Row className="mt-3">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Collection Name</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {collections && collections.map(collection => (
                <tr key={collection.id}>
                  <td><NavLink className="ms-2"style={{color: 'green'}} to={`/collection/${collection.id}`}>{collection.name}</NavLink></td>
                  <td><Button variant="info" size="sm" onClick={() => handleShowModal(collection)}>Edit</Button></td>
                  <td><Button variant="danger" size="sm"onClick={() => handleDeleteCollection(collection)}>Delete</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    );
}