// import { FaTwitter, FaInstagram, FaDiscord, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="z-[-1] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-16 relative overflow-hidden">
      {/* Неоновый абстрактный эффект */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-start gap-10">
        
        {/* Логотип и слоган */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Cyber</h1>
          <p className="text-gray-400 max-w-xs">Dive into the future. Explore, innovate, connect.</p>
        </div>

        {/* Навигация */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-gray-200 mb-2">Навигация</h2>
          <a href="#" className="hover:text-purple-400 transition-colors">Главная</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Продукты</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Контакты</a>
          <a href="#" className="hover:text-purple-400 transition-colors">О нас</a>
        </div>

        {/* Социальные сети */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-gray-200 mb-2">Следите за нами</h2>
          <div className="flex gap-4 mt-2">
            {/* {[FaTwitter, FaInstagram, FaDiscord, FaGithub].map((Icon, idx) => (
              <a key={idx} href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-xl">
                <Icon />
              </a>
            ))} */}
          </div>
        </div>
      </div>

      {/* Копирайт */}
      <div className="text-center text-gray-500 mt-12 border-t border-gray-700 pt-6 text-sm">
        © 2025 Cyber. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
