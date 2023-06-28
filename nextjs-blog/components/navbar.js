import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import LoginModal from './modals';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import logo from './images/logo.png';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { Dropdown } from 'react-bootstrap';
import { useAccount } from 'wagmi'

import { Web3Button } from '@web3modal/react';
import { useWeb3ModalTheme } from '@web3modal/react';

const Header = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useWeb3ModalTheme();

  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      fetchAdress(address);
    },
  })

  async function fetchAdress(address) {
    if (session) {
      const response = await fetch(`http://localhost:3000/api/users/${session.session.user._id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({
          id: session.session.user._id,
          walletAddress: address,
        }),
      });
    }
  }

  useEffect(() => {
    setTheme({
      themeMode: 'dark',
      themeVariables: {
        '--w3m-font-family': 'Roboto, sans-serif',
        '--w3m-accent-color': '#000000',
      },
    });
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const handleOptionClick = () => {
    setSearchQuery('');
    setDropdownOptions([]);
  };

  const fetchDropdownOptions = async (searchQuery) => {
    try {
      const response = await fetch(`http://localhost:3000/api/events?search=${searchQuery}`);
      const eventData = await response.json();
      const filteredOptions = eventData
        .filter((event) => event.title.toLowerCase().startsWith(searchQuery.toLowerCase()))
        .map((event) => ({
          id: event.id,
          title: event.title
        }));
      setDropdownOptions(filteredOptions);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (value.length > 0) {
      fetchDropdownOptions(value);
    } else {
      setSearchQuery('');
      setDropdownOptions([]);
    }
  };

  let dynamicDropdown
  if (session) {

    if (session.session.user.isAdministrator) {
      dynamicDropdown =
        <Dropdown>
          <Dropdown.Toggle size="sm" variant="secondary" id="dropdown-basic">
            Management
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="/eventManagement">
              Event management
            </Dropdown.Item>
            <Dropdown.Item href="/userManagement">
              User management
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    } else if (session.session.user.isEventmanager) {
      dynamicDropdown =
        <Link href={"/eventManagement"}>
          <Button variant="outline-secondary" size='sm'>
            My Events
          </Button>
        </Link>
    } else {
      dynamicDropdown = <></>
    }
  }

  return (
    <>
      <Navbar bg="white" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/">
            <img src={logo.src} width="200" className="d-inline-block align-top" alt="logo" />
          </Navbar.Brand>
        </Container>
        <Container>
          <Navbar.Collapse id="navbarScroll" className="justify-content-center">
            <Form className="d-flex">
              <div style={{ position: 'relative' }} >
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2 shadow-lg"
                  size="sm"
                  aria-label="Search"
                  value={searchQuery}
                  style={{ minWidth: '35vw', height: '35px', boxShadow: 'none' }}
                  onChange={handleSearchInputChange}
                />
                {dropdownOptions.length > 0 && (
                  <div className="shadow-lg" style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, minWidth: '35.5vw' }}>
                    <Card style={{ minWidth: '100%' }}>
                      <Card.Body style={{ padding: '1rem', fontSize: '1rem' }}>
                        {dropdownOptions.map((option) => (
                          <Link key={option.id} href={`/events/${encodeURIComponent(option.id)}`} style={{ textDecoration: 'none' }}>
                            <Card.Text
                              style={{ color: '#000', marginBottom: '0.5rem' }}
                              onClick={handleOptionClick}
                            >
                              {option.title}
                            </Card.Text>
                          </Link>
                        ))}
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </div>
            </Form>
          </Navbar.Collapse>
        </Container>
        <Container>
          <Navbar.Collapse className="justify-content-end">
            {session && (
              <>
                <Link href="/profile">
                  <Button size="sm" variant="outline-secondary" style={{ marginRight: '10px' }}>
                    Profile
                  </Button>
                </Link>
                <Link href="/userTickets">
                  <Button size="sm" variant="outline-secondary" style={{ marginRight: '10px' }}>
                    My Tickets
                  </Button>
                </Link>
                {dynamicDropdown}
                <Web3Button className="me-2 shadow-lg" size="sm" style={{ padding: '5px 10px', marginLeft: '10px' }} />
              </>
            )}
            <LoginModal />
          </Navbar.Collapse>
        </Container>
      </Navbar >
    </>
  );
};

export default Header;
