import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src="/box-svgrepo-com.svg" alt="logo" className="w-8 h-8" />
            <h3 className="text-2xl font-bold text-indigo-400">UniNote</h3>
          </div>
          <ul className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
            <li>
              <a
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Browse
              </a>
            </li>
            <li>
              <a
                href="/seller"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Become a Seller
              </a>
            </li>
            <li>
              <a
                href="mailto:support@uninote.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2025 UniNote. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;