import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import {FaBox, FaCat, FaShoppingCart, FaUsers} from "react-icons/fa";

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
                        <Nav.Link
                            as={NavLink}
                            to="/suppliers"
                            className="sidebar-link py-2"
                            activeClassName="active-link"
                        >
                            <FaUsers className="me-2" /> Suppliers
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/categories"
                            className="sidebar-link py-2"
                            activeClassName="active-link"
                        >
                            <FaCat className="me-2" /> Categories
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/purchases"
                            className="sidebar-link py-2"
                            activeClassName="active-link"
                        >
                            <FaShoppingCart className="me-2" /> Purchases
                        </Nav.Link>
                    </Nav>

                </Container>
            </Navbar>
        </div>
    );
};

export default Sidebar;
