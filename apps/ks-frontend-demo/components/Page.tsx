import { Container } from 'react-bootstrap';
import { Footer } from './Footer';
import { Header } from './Header';

export const Page = function ({ children }) {
  return (
    <>
      <Header />
      <Container style={{ paddingBottom: '15rem', paddingTop: '5rem' }}>
        {children}
      </Container>
      <Footer />
    </>
  );
};
