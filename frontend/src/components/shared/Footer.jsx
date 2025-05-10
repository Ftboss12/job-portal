import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-gray-200 py-6 text-center mt-auto">
      {/* Social Media Icons */}
      <div className="flex justify-center gap-6 mb-3">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
          <FaFacebook className="text-blue-500 text-2xl hover:text-blue-700" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
          <FaTwitter className="text-blue-400 text-2xl hover:text-blue-600" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
          <FaInstagram className="text-pink-500 text-2xl hover:text-pink-700" />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
          <FaLinkedin className="text-blue-600 text-2xl hover:text-blue-800" />
        </a>
      </div>

      {/* Company Info */}
      <p className="text-sm">&copy; {new Date().getFullYear()} <span className="font-semibold">JobNative</span>. All rights reserved.</p>

      {/* Developer Info */}
      <p className="text-xs mt-1">
        Developed by <a href="http://ujjwalsingh.rf.gd" className="text-blue-400 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">Ujjwal Singh</a>
      </p>
    </footer>
  );
}

export default Footer;
