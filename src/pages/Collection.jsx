import React, { useEffect, useState } from 'react';
import { Container, Col, Row, Button, Table, Modal, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { NavLink, useParams } from 'react-router-dom';
import { fetchCollectionItems, collectionItems } from '../redux/slices/items';
import {  myCollections } from '../redux/slices/collections';

import { jwtDecode } from "jwt-decode";
import axios from '../axios';
import {useDispatch, useSelector} from 'react-redux';

export const Collection = () => {
  
    const dispatch = useDispatch();
    const { id } = useParams();
    const [showModalItem, setShowModalItem] = useState(false);
    const items = useSelector(collectionItems)
    const collections = useSelector(myCollections)
    const selectedCollection = collections.find(collection => collection.id.toString() === id);
    console.log(selectedCollection, '5')

    const [selectedItem, setSelectedItem] = useState(null);
    const initialValues = selectedItem || {};

    const { 
      register, 
      handleSubmit, 
      reset,
      setValue,
      formState: { errors } 
    } = useForm({
      defaultValues: {
        collection_id: initialValues.collection_id || '',
        name: initialValues.name || '', 
        tags: initialValues.tags || '', 
        custom_int1: initialValues.custom_int1 || '',
        custom_int2: initialValues.custom_int2 || '',
        custom_int3: initialValues.custom_int3 || '',
        custom_string1: initialValues.custom_string1 || '',
        custom_string2: initialValues.custom_string2 || '',
        custom_string3: initialValues.custom_string3 || '',
        custom_text1: initialValues.custom_text1 || '',
        custom_text2: initialValues.custom_text2 || '',
        custom_text3: initialValues.custom_text3 || '',
        custom_boolean1: initialValues.custom_boolean1 || false,
        custom_boolean2: initialValues.custom_boolean2 || false,
        custom_boolean3: initialValues.custom_boolean3 || false,
        custom_date1: initialValues.custom_date1 || '',
        custom_date2: initialValues.custom_date2 || '',
        custom_date3: initialValues.custom_date3 || '',
      },
      mode: 'onChange'
    });

    useEffect(() => {      
        dispatch(fetchCollectionItems(selectedCollection.id))       
        setValue('collection_id', selectedCollection.id);
    }, []);

    useEffect(() => {
      if (selectedItem) {
        Object.keys(selectedItem).forEach(key => {
          setValue(key, selectedItem[key]);
        });
      }
    }, [selectedItem, setValue]);
    
    const handleCloseModal = () => {
      setShowModalItem(false);
      setSelectedItem(null);
      reset()
      setValue('collection_id', selectedCollection.id);
    };

    const handleShowModal = (item = null) => {
      setShowModalItem(true);
      if (item) {
        const tagsAsString = item.tags.join(', ');
        const newItem = { ...item, tags: tagsAsString };
        setSelectedItem(newItem);
        
        console.log(newItem);
      } else {
        setSelectedItem(null); 
      }
    };
    

    const handleCreateCollection = (data) => {
      const transformedData = {
        ...data,
        custom_int1: parseInt(data.custom_int1),
        custom_int2: parseInt(data.custom_int2),
        custom_int3: parseInt(data.custom_int3),
        custom_boolean1: Boolean(data.custom_boolean1),
        custom_boolean2: Boolean(data.custom_boolean2),
        custom_boolean3: Boolean(data.custom_boolean3),
        custom_date1: data.custom_date1 ? new Date(data.custom_date1) : null,
        custom_date2: data.custom_date2 ? new Date(data.custom_date2) : null,
        custom_date3: data.custom_date3 ? new Date(data.custom_date3) : null,
    };

    console.log(transformedData, '1');
    
    axios.post('/api/item/create', transformedData)
         .then(() => {
            dispatch(fetchCollectionItems(transformedData.collection_id)); 
            setShowModalItem(false);
            reset()
            setValue('collection_id', selectedCollection.id);
         })
         .catch((error) => {
             console.error('Failed to create item:', error);
         });
    };

    const handleEditCollection = (data) => {
      console.log(data)
      const itemId = selectedItem.id;
      const collectionId = selectedItem.collection_id;
      axios.patch(`/api/item/update/${itemId}`, data);
      dispatch(fetchCollectionItems(collectionId)) 
      setShowModalItem(false);
    };    

    const handleDeleteCollection = (data) => {
      const itemId = data.id;      
      const collectionId = data.collection_id
      axios.delete(`/api/item/remove/${itemId}`, data);
      dispatch(fetchCollectionItems(collectionId))
    };

    return (
      <Container className="mt-3">
        <Row>
          <Col className="d-flex justify-content-between align-items-center">
          {selectedCollection && <h2>{selectedCollection.name}</h2>}
            <Button 
              variant={"outline-dark"} 
              size="sm"
              onClick={() => handleShowModal()}>Add new Item</Button>
          </Col>
        </Row>
        <Row>
          
          {selectedCollection && <p>{selectedCollection.description}</p>}            
        </Row>
        <Modal show={showModalItem} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedItem ? 'Edit Item' : 'Create New Item'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(selectedItem ? handleEditCollection : handleCreateCollection)}>
                    <Form.Group controlId="formName">
                      <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" {...register("name", { required: true })} />
                    </Form.Group>
                    <Form.Group controlId="formTags">
                      <Form.Label>Tags</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter tags" 
                        {...register("tags", { 
                          required: true,
                          validate: (value) => value.split(',').length >= 1 
                        })} 
                      />
                        {errors.tags && errors.tags.type === "validate" && (
                          <Form.Text className="text-danger">
                            At least one tag is required.
                          </Form.Text>
                        )}
                    </Form.Group>
                    {selectedCollection && selectedCollection.custom_int1_state && (
                      <Form.Group controlId="formCustomInt1">
                        <Form.Label>{selectedCollection.custom_int1_name}</Form.Label>
                        <Form.Control type="number" placeholder={`Enter ${selectedCollection.custom_int1_name}`} {...register("custom_int1", { required: true })} />
                      </Form.Group>
                    )} 
                    {selectedCollection && selectedCollection.custom_int2_state && (
                      <Form.Group controlId="formCustomInt1">
                        <Form.Label>{selectedCollection.custom_int2_name}</Form.Label>
                        <Form.Control type="number" placeholder={`Enter ${selectedCollection.custom_int2_name}`} {...register("custom_int2", { required: true })} />
                      </Form.Group>
                    )}  
                    {selectedCollection && selectedCollection.custom_int3_state && (
                      <Form.Group controlId="formCustomInt1">
                        <Form.Label>{selectedCollection.custom_int3_name}</Form.Label>
                        <Form.Control type="number" placeholder={`Enter ${selectedCollection.custom_int3_name}`} {...register("custom_int3", { required: true })} />
                      </Form.Group>
                    )} 

                    {selectedCollection && selectedCollection.custom_string1_state && (
                      <Form.Group controlId="formCustomString1">
                        <Form.Label>{selectedCollection.custom_string1_name}</Form.Label>
                        <Form.Control type="text" placeholder={`Enter ${selectedCollection.custom_string1_name}`} {...register("custom_string1", { required: true })} />
                      </Form.Group>
                    )} 
                    {selectedCollection && selectedCollection.custom_string2_state && (
                      <Form.Group controlId="formCustomString2">
                        <Form.Label>{selectedCollection.custom_string2_name}</Form.Label>
                        <Form.Control type="text" placeholder={`Enter ${selectedCollection.custom_string2_name}`} {...register("custom_string2", { required: true })} />
                      </Form.Group>
                    )} 
                    
                    {selectedCollection && selectedCollection.custom_string3_state && (
                      <Form.Group controlId="formCustomString3">
                        <Form.Label>{selectedCollection.custom_string3_name}</Form.Label>
                        <Form.Control type="text" placeholder={`Enter ${selectedCollection.custom_string3_name}`} {...register("custom_string3", { required: true })} />
                      </Form.Group>
                    )}

                    {selectedCollection && selectedCollection.custom_text1_state && (
                      <Form.Group controlId="formCustomText1">
                        <Form.Label>{selectedCollection.custom_text1_name}</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder={`Enter ${selectedCollection.custom_text1_name}`} {...register("custom_text1", { required: true })} />
                      </Form.Group>
                    )} 
                    {selectedCollection && selectedCollection.custom_text2_state && (
                      <Form.Group controlId="formCustomText2">
                        <Form.Label>{selectedCollection.custom_text2_name}</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder={`Enter ${selectedCollection.custom_text2_name}`} {...register("custom_text1", { required: true })} />
                      </Form.Group>
                    )} 
                    {selectedCollection && selectedCollection.custom_text3_state && (
                      <Form.Group controlId="formCustomText3">
                        <Form.Label>{selectedCollection.custom_text3_name}</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder={`Enter ${selectedCollection.custom_text3_name}`} {...register("custom_text1", { required: true })} />
                      </Form.Group>
                    )}

                    {selectedCollection && selectedCollection.custom_boolean1_state && (
                      <Form.Group controlId="formCustomBoolean1">
                        <Form.Check type="checkbox" label={selectedCollection.custom_boolean1_name} {...register("custom_boolean1", { required: true })} />
                      </Form.Group>
                    )} 
                    {selectedCollection && selectedCollection.custom_boolean2_state && (
                      <Form.Group controlId="formCustomBoolean2">
                        <Form.Check type="checkbox" label={selectedCollection.custom_boolean2_name} {...register("custom_boolean2", { required: true })} />
                      </Form.Group>
                    )} 
                    {selectedCollection && selectedCollection.custom_boolean3_state && (
                      <Form.Group controlId="formCustomBoolean3">
                        <Form.Check type="checkbox" label={selectedCollection.custom_boolean3_name} {...register("custom_boolean3", { required: true })} />
                      </Form.Group>
                    )}
                    {selectedCollection && selectedCollection.custom_date1_state && (
                      <Form.Group controlId="formCustomDate1">
                        <Form.Label>{selectedCollection.custom_date1_name}</Form.Label>
                        <Form.Control type="date" placeholder={`Enter ${selectedCollection.custom_date1_name}`} {...register("custom_date1", { required: true })} />
                      </Form.Group>
                    )}
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button variant="primary" type="submit">{selectedItem ? 'Edit' : 'Create'}</Button>
                      </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        <Row className="mt-3">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {items && items.map(item => (
                <tr key={item.id}>
                  <td><NavLink className="ms-2"style={{color: 'green'}} to={`/item/${item.id}`}>{item.name}</NavLink></td>
                  <td>{item.name}</td>
                  <td><Button variant="info" size="sm" onClick={() => handleShowModal(item)}>Edit</Button></td>
                  <td><Button variant="danger" size="sm"onClick={() => handleDeleteCollection(item)}>Delete</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    );
}