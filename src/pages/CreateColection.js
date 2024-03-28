import React, { useEffect, useState } from 'react';
import { Container, Col, Row, Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { NavLink, useNavigate} from 'react-router-dom';
import { fetchCollections } from '../redux/slices/collections';

export const CreateCollection = () => {
    const navigate = useNavigate()

    const [collections, setCollections] = useState(null)
    const {id} = useParams()

    useEffect(() => {
      // fetchCollections().then(data => setCollections(data))
    }, [])

    return (
      <Container className="mt-3">
        <Row>
          <Col className="d-flex justify-content-between align-items-center">
            <h2>My collections</h2>
            <Button 
              variant={"outline-dark"} 
              size="sm"
              onClick={() => navigate("/user")}>Add new Collection</Button>
          </Col>
        </Row>
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
              <tr >
                <td><NavLink className="ms-2"style={{color: 'green'}} to="/collection/:id">ааыв</NavLink></td>
                <td><Button variant="info" size="sm">Edit</Button></td>
                <td><Button variant="danger" size="sm">Delete</Button></td>
              </tr>
            </tbody>
          </Table>
        </Row>
      </Container>
    );
}



