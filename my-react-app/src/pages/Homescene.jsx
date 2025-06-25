import React, { useEffect } from 'react';
import Homepage from './Homepage';
import './homestyle.css';
import Navbar from '../components/Navbar';

function Homescene() {
  useEffect(() => {
    console.log('Homescene mounted');
  }, []);

  return (
    <div className="homescene-root">
      <div style={{ position: 'relative', width: '100vw', minHeight: '100vh' }}>
        {/* 3D Background */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none'
        }}>
          <Homepage />
        </div>

        {/* Main Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />

          {/* Banner Section */}
          <div className="section" id="banner">
            <div className="content-fit">
              <div className="title" data-before="Buy respect">Buy Cars</div>
            </div>
          </div>

          {/* Intro Section */}
          <div className="section" id="intro">
            <div className="content-fit">
              <div className="number">01</div>
              <div className="des">
                <div className="title">Best premium deals</div>
                <p>The Car Cart website is a user-friendly e-commerce platform focused on the automotive market. It allows users to explore a wide range of vehicles — including new, used, and certified pre-owned cars — as well as car accessories and parts. The website serves as a one-stop solution for car enthusiasts, buyers, and sellers.</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="section" id="description">
            <div className="content-fit">
              <div className="number">02</div>
              <div className="des">
                <div className="title">Carbay</div>
                <p>A Car Cart system is a specialized e-commerce or marketplace platform developed to facilitate the buying, selling, and management of automobiles and related services online. The system combines web technologies, databases, user interfaces, and payment gateways to offer a seamless experience for both car buyers and sellers.</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="section" id="contact">
            <div className="content-fit">
              <div className="number">03</div>
              <div className="des">
                <div className="title">CONTACT</div>
                <table>
                  <tbody>
                    <tr>
                      <td>Email</td>
                      <td>carbay@gmail.com</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td>+91-8317346967</td>
                    </tr>
                    <tr>
                      <td>Website</td>
                      <td>Carbay.com</td>
                    </tr>
                    <tr>
                      <td>Youtube</td>
                      <td>@Shourangas</td>
                    </tr>
                  </tbody>
                </table>
                <div className="sign">D-dev</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homescene;