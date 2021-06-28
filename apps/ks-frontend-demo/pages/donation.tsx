import { useSession } from 'next-auth/client';
import { Container, Row, Button, Col } from 'react-bootstrap';

export default function Donation() {
  const [session, loading] = useSession();

  if (loading) return <Container>Loading... </Container>;
  return (
    <Container>
      <Row>
        <Col>
          <h3>Thanks {session.user.name}, you are now signed into the Wifi</h3>
        </Col>
        <Col>
          <h3> If you would like to donate to The Old Church on the Hill...</h3>
          <Button
            href="https://www.collective.org.au/donate/"
            variant="primary"
            type="button"
            size="lg"
            block
          >
            {' '}
            Donate
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
