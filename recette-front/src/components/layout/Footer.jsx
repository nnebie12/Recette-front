import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'À propos': [
      { name: 'Qui sommes-nous', path: '/about' },
      { name: 'Notre équipe', path: '/team' },
      { name: 'Contact', path: '/contact' }
    ],
    'Recettes': [
      { name: 'Toutes les recettes', path: '/recipes' },
      { name: 'Recettes populaires', path: '/recipes?sort=popular' },
      { name: 'Nouvelles recettes', path: '/recipes?sort=recent' }
    ],
    'Légal': [
      { name: 'Conditions d\'utilisation', path: '/terms' },
      { name: 'Politique de confidentialité', path: '/privacy' },
      { name: 'Mentions légales', path: '/legal' }
    ]
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <span className="text-xl font-bold text-white">RecetteApp</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Découvrez et partagez vos recettes préférées avec notre communauté passionnée de cuisine.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {currentYear} RecetteApp. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;