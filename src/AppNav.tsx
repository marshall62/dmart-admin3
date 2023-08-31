import { Nav, Navbar } from "react-bootstrap"
import { Link } from "react-router-dom"


function AppNav ({loggedIn}) {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Dmart Admin</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Link to="/" className="mx-2">Home</Link>
                    {!loggedIn && <Link to="/login" className="mx-2">Log In</Link>}
                    {loggedIn && <Link to="/logout" className="mx-2">Log out</Link>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default AppNav