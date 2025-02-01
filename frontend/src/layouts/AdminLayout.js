import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => {
    return (
        <Container fluid>
            <Row>
                <Col md={2}>
                    <Sidebar />
                </Col>
                <Col md={10}>
                    <main className='p-5'>{children}</main>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLayout;
