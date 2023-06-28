import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#f2f2f2', padding: '20px', display: 'flex', flexDirection: 'column', marginTop: "5rem" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ marginRight: '40px' }}>
          <h4 style={{ color: '#333', fontSize: '16px', marginBottom: '10px' }}>Contact</h4>
          <p>Phone: +49 (0)5-BLOCKCHAIN <br />Email: info@blockevents.com</p>
        </div>
        <div style={{ marginRight: '40px' }}>
          <h4 style={{ color: '#333', fontSize: '16px', marginBottom: '10px' }}>Privacy</h4>
          <p>Read our <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" style={{ color: '#666', textDecoration: 'underline' }}>Privacy Policy</a> for more information.</p>
        </div>
        <div style={{ marginRight: '40px' }}>
          <h4 style={{ color: '#333', fontSize: '16px', marginBottom: '10px' }}>Address</h4>
          <p>BlockEvents GmbH<br />Block Street, NFT City, Crypto County, BC12345</p>
        </div>
        <div style={{ marginRight: '40px' }}>
          <h4 style={{ color: '#333', fontSize: '16px', marginBottom: '10px' }}>FAQ</h4>
          <p>Visit our <a href="https://gitlab.bht-berlin.de/s85885/blockevent/-/wikis/home" style={{ color: '#666', textDecoration: 'underline' }}>FAQ page</a> for common questions and answers.</p>
        </div>
      </div>
      <div>
        <p style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>© 2023 BlockEvents. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
