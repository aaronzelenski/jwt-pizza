import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer({ navItems }) {
  return (
    <footer className='m-8 flex justify-center'>
      <div className='container border-t-2 border-gray-200 max-w-3xl'>
        <nav className='-mb-0.5 flex space-x-6 justify-between'>
          {navItems.map(
            (item) =>
              item.display.includes('footer') && (
                <NavLink key={item.title} className=' py-4 px-1 inline-flex items-center gap-2 text-sm whitespace-nowrap text-gray-200 hover:text-orange-600 focus:text-orange-600' to={item.to}>
                  {item.title}
                </NavLink>
              )
          )}
        </nav>
        <p className='text-sm text-center italic text-gray-400'>© 2024 JWT Pizza LTD. All rights reserved.</p>
      </div>
    </footer>
  );
}
