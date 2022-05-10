import React from 'react';
import { Navbar } from 'react-bootstrap';

export const Footer = function () {
  return (
    <Navbar bg="dark" fixed="bottom" variant="dark" expand="sm">
      <Navbar.Text
        className="justify-content-end"
        style={{ marginLeft: '2rem' }}
      >
        This is a demo app using KeystoneJS and Auth0 via Next-Auth
      </Navbar.Text>
    </Navbar>
  );
};
