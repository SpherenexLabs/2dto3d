import { useState } from 'react';
import logo from '../assets/newlogo2.png';
import heroImage from '../assets/hero1.png';
import { 
  Home, 
  Sparkles, 
  Box, 
  Sofa, 
  Zap, 
  Smartphone, 
  Save, 
  Upload, 
  Cpu, 
  Eye,
  Star,
  ChevronRight,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  Clock
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: <Cpu size={32} />,
      title: 'AI-Powered Analysis',
      description: 'Automatically detect rooms, walls, and architectural features from floor plans.'
    },
    {
      icon: <Box size={32} />,
      title: 'Realistic 3D Models',
      description: 'Generate accurate 3D visualizations with proper dimensions.'
    },
    {
      icon: <Sofa size={32} />,
      title: 'Furniture Library',
      description: 'Choose from a curated collection of furniture and decorations.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Quick Conversion',
      description: 'Transform floor plans to 3D in seconds.'
    },
    {
      icon: <Smartphone size={32} />,
      title: 'Cross-Platform',
      description: 'Works on desktop, tablet, and mobile devices.'
    },
    {
      icon: <Save size={32} />,
      title: 'Save & Export',
      description: 'Export your designs for presentations and sharing.'
    }
  ];

  const steps = [
    {
      number: '01',
      icon: <Upload size={40} />,
      title: 'Upload Your Floor Plan',
      description: 'Simply drag and drop your 2D floor plan image (JPEG, PNG, or SVG) into our converter.'
    },
    {
      number: '02',
      icon: <Cpu size={40} />,
      title: 'AI Analysis & Conversion',
      description: 'Our AI analyzes your floor plan and automatically generates a 3D model with accurate dimensions.'
    },
    {
      number: '03',
      icon: <Eye size={40} />,
      title: 'Customize & Explore',
      description: 'Add furniture, change materials, adjust lighting, and explore your space in stunning 3D.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Interior Designer',
      initial: 'SM',
      text: 'This tool has revolutionized how we present designs to clients. The 3D visualizations are incredibly accurate and help clients understand the space before construction begins.'
    },
    {
      name: 'John Davis',
      role: 'Architect',
      initial: 'JD',
      text: 'As an architect, I need precision and speed. This converter delivers both. It\'s become an essential part of my workflow for client presentations.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Homeowner',
      initial: 'ER',
      text: 'I was able to visualize my home renovation before making any decisions. It saved me from costly mistakes and gave me confidence in my design choices.'
    }
  ];

  const galleryItems = [
    {
      image: 'https://d28pk2nlhhgcne.cloudfront.net/assets/app/uploads/sites/3/2023/06/how-to-master-art-living-room-interior-design-4-720x397.png',
      title: 'Modern Living Room',
      description: 'Spacious open-concept design'
    },
    {
      image: 'https://d28pk2nlhhgcne.cloudfront.net/assets/app/uploads/sites/3/2025/10/3d-bedroom-floor-plan-720x803.png',
      title: 'Cozy Bedroom',
      description: 'Comfortable design with natural lighting'
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvt3_TLrrnxmz3dE55xCcSYxuOJtyOGJthQg&s',
      title: 'Modern Kitchen',
      description: 'Sleek kitchen with island'
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img src={logo} alt="PlanNex3D" className="logo-image" />
            </div>
            
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
              <a href="#features" onClick={() => scrollToSection('features')}>Features</a>
              <a href="#how-it-works" onClick={() => scrollToSection('how-it-works')}>How It Works</a>
              <a href="#gallery" onClick={() => scrollToSection('gallery')}>Gallery</a>
              <a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Testimonials</a>
              <a href="#contact" onClick={() => scrollToSection('contact')}>Contact Us</a>
              <button className="cta-button" onClick={onGetStarted}>
                Get Started
                <ChevronRight size={20} />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-left">
              <h1>Transform Floor Plans into 3D Reality</h1>
              <h2 className="hero-subtitle">Visualize spaces in stunning 3D — instantly</h2>
              <p className="hero-description">
                Our AI-powered platform converts your 2D floor plans into immersive 3D visualizations. 
                Whether you're an architect, interior designer, or real estate professional, bring your 
                spaces to life with accurate dimensions and realistic rendering.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={onGetStarted}>
                  Get Started for Free
                </button>
                <button className="btn-secondary" onClick={() => scrollToSection('how-it-works')}>
                  See How It Works
                </button>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-image">
                <img 
                  src={heroImage} 
                  alt="3D Room Visualization"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to visualize your perfect space</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
       <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to bring your floor plans to life</p>
          </div>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-header">
                  <div className="step-number">{step.number}</div>
                  <div className="step-icon">{step.icon}</div>
                </div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery" id="gallery">
        <div className="container">
          <div className="section-header">
            <h2>Gallery</h2>
            <p>See what's possible with our converter</p>
          </div>
          <div className="gallery-grid">
            {galleryItems.map((item, index) => (
              <div key={index} className="gallery-item">
                <div className="gallery-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="gallery-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> 

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Trusted by professionals and homeowners worldwide</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="#FFC107" stroke="#FFC107" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.initial}</div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      {/* <section className="contact-section" id="contact">
        <div className="container">
          <div className="section-header">
            <h2>Get in Touch</h2>
            <p>We're here to help bring your vision to life</p>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">
                <MapPin size={28} />
              </div>
              <h3>Address</h3>
              <p>48/58, 1st Floor, Chunchghatta Main Rd,</p>
              <p>JP Nagar 7th Phase,</p>
              <p>Konanakutte,</p>
              <p>Bangalore, Karnataka - 560062</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <Phone size={28} />
              </div>
              <h3>Call Us</h3>
              <p><a href="tel:+918861938913">+91 88619 38913</a></p>
              <p><a href="tel:+916360655852">+91 6360655852</a></p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <Mail size={28} />
              </div>
              <h3>Email Us</h3>
              <p><a href="mailto:tanush.hd@spherenex.com">tanush.hd@spherenex.com</a></p>
              <p><a href="mailto:office@spherenex.com">office@spherenex.com</a></p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <Clock size={28} />
              </div>
              <h3>Open Hours</h3>
              <p>Monday - Friday</p>
              <p>9:00 AM - 05:00 PM</p>
              <p>Saturday - Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Floor Plans?</h2>
            <p>Start creating stunning 3D visualizations today. No credit card required.</p>
            <button className="btn-primary" onClick={onGetStarted}>
              Get Started Free
              <ChevronRight size={20} />
            </button>
            
            <div className="other-products">
              <h3>Explore Our Other Products</h3>
              <div className="product-links">
                <a href="https://www.spherenex.com/" target="_blank" rel="noopener noreferrer" className="product-link">
                  Spherenex Official Website
                </a>
                <a href="https://procartindia.in/" target="_blank" rel="noopener noreferrer" className="product-link">
                  ProcartIndia
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            <p>&copy; 2025 PlanNex3D. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <div className="footer-logo">
                <Home size={28} />
                <span>Room Converter</span>
              </div>
              <p>Transform your 2D floor plans into immersive 3D spaces with our AI-powered converter.</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
              </div>
            </div>

            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#features" onClick={() => scrollToSection('features')}>Features</a></li>
                <li><a href="#how-it-works" onClick={() => scrollToSection('how-it-works')}>How It Works</a></li>
                <li><a href="#gallery" onClick={() => scrollToSection('gallery')}>Gallery</a></li>
                <li><a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Testimonials</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Resources</h3>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API</a></li>
                <li><a href="#">Support</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Company</h3>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 PlanNex3D. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default LandingPage;


