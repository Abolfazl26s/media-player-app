const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-center p-4 absolute bottom-0">
      <p className="text-gray-500 text-sm">
        &copy; {currentYear} Created by Abolfazl Saeidabadi. All Rights
        Reserved.
      </p>
    </footer>
  );
};

export default Footer;
