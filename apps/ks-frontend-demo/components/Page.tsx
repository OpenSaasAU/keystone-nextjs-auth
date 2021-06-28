import { Container } from 'react-bootstrap';
import { Footer } from './Footer';
import { Header } from './Header';

export function Page({ children }) {
  return (
    <>
      <Header />
      <Container style={{ paddingBottom: '15rem', paddingTop: '5rem' }}>{children}</Container>
      <Footer />
    </>
  );
}
