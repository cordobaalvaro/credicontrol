import { Card, Row, Col, Form } from 'react-bootstrap';
const CobradorFilterCard = ({ mesFiltro, setMesFiltro }) => {
  return (
    <Card className="filter-card mb-4 shadow-sm border-0">
      <Card.Body className="p-3">
        <Row className="g-3 align-items-center justify-content-end">
          <Col md="auto" className="d-flex align-items-center">
            <Form.Label className="me-2 mb-0 fw-medium text-muted">Mes</Form.Label>
            <Form.Control
              type="month"
              value={mesFiltro}
              onChange={(e) => setMesFiltro(e.target.value)}
              className="border-0 bg-light mx-w-200"
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
export default CobradorFilterCard;
