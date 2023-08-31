import { useContext, useEffect, useState } from "react";
import { Form, Button} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isAnon } from "../utils";
import MongoContext from "../contexts/MongoContext";

export default function Login( {onLogin}) {

  const navigate = useNavigate()
  const mongoContext = useContext(MongoContext);
  const [formData, setFormData] = useState({});

  useEffect(() => {	
    if (!isAnon(mongoContext.user)) {
      navigate('/')
    }
  }, [navigate, mongoContext.user])
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password)
  }

  const handleFieldChange = (e) => {
    // clever way to set any field where field name is [e.target.id]
    setFormData({...formData, [e.target.id]: e.target.value})
  }


  return(<>
 <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" onChange={handleFieldChange} placeholder="Enter email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" onChange={handleFieldChange} placeholder="Password" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
  </Form>
  {/* <Link to='/dashboard'>Dashboard</Link> */}
  </>)
}