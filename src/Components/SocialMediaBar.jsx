import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const SocialMediaBar = () => {
  return (
    <div className="flex flex-row gap-5 items-left pt-[20px] lg:pt-[60px]">
      <a href="https://github.com/MarvinMosiCoder" target="_blank" rel="noopener noreferrer">
        <FaGithub className="text-teal-100 hover:text-teal-300 transition duration-300" size={24} />
      </a>
      <a href="https://www.linkedin.com/in/marvin-mosico-0b1467210/" target="_blank" rel="noopener noreferrer">
        <FaLinkedin className="text-teal-100 hover:text-teal-300 transition duration-300" size={24} />
      </a>

      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <FaInstagram className="text-teal-100 hover:text-teal-300 transition duration-300" size={24} />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <FaTwitter className="text-teal-100 hover:text-teal-300 transition duration-300" size={24} />
      </a>
      <a href="https://www.facebook.com/MarvinMosicoo" target="_blank" rel="noopener noreferrer">
        <FaFacebook className="text-teal-100 hover:text-teal-300 transition duration-300" size={24} />
      </a>
    </div>
  );
};

export default SocialMediaBar;