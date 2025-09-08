import React from 'react';

interface FooterProps {
  isDark: boolean;
}

export default function Footer({ isDark }: FooterProps) {
  return (
    <footer
      className={`py-8 text-center ${
        isDark ? 'bg-black text-gray-400' : 'bg-gray-100 text-gray-700'
      }`}
    >
      <p>© {new Date().getFullYear()} Maple. 保留所有权利.</p>
    </footer>
  );
}
