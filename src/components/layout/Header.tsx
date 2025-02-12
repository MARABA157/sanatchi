import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { FiSun, FiMoon, FiMenu } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderContainer = styled(motion.header)<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.isScrolled 
    ? theme.colors.primary.white 
    : 'transparent'};
  backdrop-filter: ${props => props.isScrolled ? 'blur(10px)' : 'none'};
  box-shadow: ${props => props.isScrolled ? theme.shadows.sm : 'none'};
  transition: all ${theme.transitions.medium};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  max-width: ${theme.layout.maxWidth};
  margin: 0 auto;
`;

const Logo = styled(motion.div)`
  font-family: ${theme.typography.heading.fontFamily};
  font-size: ${theme.typography.heading.sizes.h3};
  font-weight: ${theme.typography.heading.weights.bold};
  color: ${theme.colors.primary.gold};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  font-family: ${theme.typography.body.fontFamily};
  font-weight: ${theme.typography.body.weights.medium};
  color: ${theme.colors.accent.darkGray};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${theme.colors.primary.gold};
    transition: width ${theme.transitions.fast};
  }

  &:hover::after {
    width: 100%;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const IconButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: ${theme.layout.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.accent.darkGray};
  background: ${theme.colors.accent.softGray};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.primary.gold};
    color: ${theme.colors.primary.white};
    transform: ${theme.effects.hover.scale};
  }
`;

const MobileMenuButton = styled(IconButton)`
  display: none;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.primary.white};
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  z-index: 999;
`;

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xxl};
`;

const MobileNavLink = styled(NavLink)`
  font-size: ${theme.typography.heading.sizes.h3};
`;

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  const menuItems = [
    { title: 'Keşfet', href: '/discover' },
    { title: 'AI Workshop', href: '/workshop' },
    { title: 'Sanatçılar', href: '/artists' },
    { title: 'Hakkında', href: '/about' },
  ];

  return (
    <HeaderContainer
      isScrolled={isScrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderContent>
        <Logo
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sanat Galerisi
        </Logo>

        <Nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {item.title}
            </NavLink>
          ))}
        </Nav>

        <Controls>
          <IconButton
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </IconButton>

          <MobileMenuButton
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMenu size={20} />
          </MobileMenuButton>
        </Controls>
      </HeaderContent>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <IconButton
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ alignSelf: 'flex-end' }}
            >
              ✕
            </IconButton>

            <MobileNav>
              {menuItems.map((item) => (
                <MobileNavLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ x: 10 }}
                  whileTap={{ x: 0 }}
                >
                  {item.title}
                </MobileNavLink>
              ))}
            </MobileNav>
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};
