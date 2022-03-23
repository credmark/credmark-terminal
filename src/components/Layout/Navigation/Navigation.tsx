import React, { FC } from 'react';

import Navbar from './Navbar/Navbar';

interface NavigationProps {
  onToggle: () => void;
}

const Navigation: FC<NavigationProps> = ({ onToggle }) => {
  const routes = [
    {
      name: 'Analytics',
      link: '/analytics',
    },
    {
      name: 'Risk Library',
      link: '/risk-library',
    },
  ];

  return (
    <>
      <Navbar onToggle={onToggle} routes={routes} />
    </>
  );
};
export default Navigation;
