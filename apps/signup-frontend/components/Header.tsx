import { Navbar } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';


export function Header() {
  return (
    <Navbar bg="light" expand="sm">
      <Navbar.Brand style={{ marginLeft: '4rem', marginBottom: '1rem' }}>
        <Link href="https://www.opensaas.com.au">
          <Image
            src="/images/logo-opensaas.png"
            height="70"
            width="230"
            alt="OpenSaas Logo"
          />
        </Link>
      </Navbar.Brand>
    </Navbar>
  );
}
