const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Pootie Tang Dictionary. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
