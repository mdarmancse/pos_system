import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FaBox, FaUsers } from "react-icons/fa"; // You can add icons for better UX

const Sidebar = () => {
    return (
        <div className="sidebar-container">
            <Navbar bg="dark" variant="dark" className="sidebar flex-column vh-100">
                <Container className="px-3">

                    <Nav className="flex-column w-100">
                        <Nav.Link
                            as={NavLink}
                            to="/"
                            className="sidebar-link py-2"
                            activeClassName="active-link"
                        >
                            <FaBox className="me-2" /> Products
                        </Nav.Link>

                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
};

export default Sidebar;
