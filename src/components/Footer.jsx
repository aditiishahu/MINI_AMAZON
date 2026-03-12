import { Link } from "react-router-dom";
import { ChevronUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const footerSections = [
    {
      title: "Get to Know Us",
      links: ["Careers", "Blog", "About Amazon", "Investor Relations", "Amazon Devices", "Amazon Science"],
    },
    {
      title: "Make Money with Us",
      links: ["Sell products on Amazon", "Sell on Amazon Business", "Sell apps on Amazon", "Become an Affiliate", "Advertise Your Products", "Self-Publish with Us"],
    },
    {
      title: "Amazon Payment Products",
      links: ["Amazon Business Card", "Shop with Points", "Reload Your Balance", "Amazon Currency Converter"],
    },
    {
      title: "Let Us Help You",
      links: ["Amazon and COVID-19", "Your Account", "Your Orders", "Shipping Rates & Policies", "Returns & Replacements", "Manage Your Content", "Help"],
    },
  ];

  return (
    <footer className="w-full mt-auto">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-white text-sm py-3 transition-colors"
      >
        <div className="flex items-center justify-center gap-2">
          <ChevronUp size={16} />
          Back to top
        </div>
      </button>

      {/* Links Grid */}
      <div className="bg-[#232F3E] text-white">
        <div className="max-w-[1500px] mx-auto px-8 py-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-white text-sm mb-3">{section.title}</h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-[#DDD] text-xs hover:text-white hover:underline">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#3a4553]" />

        {/* Logo + Language + Currency Row */}
        <div className="max-w-[1500px] mx-auto px-8 py-6 flex flex-wrap items-center justify-center gap-4">
          <Link to="/">
            <div className="flex flex-col items-center leading-none border-2 border-[#5a6a7a] hover:border-white rounded px-2 py-1">
              <span className="text-white font-extrabold text-lg tracking-tight">amazon</span>
              <span className="text-[#FF9900] text-[9px] font-bold tracking-widest">.mini</span>
            </div>
          </Link>
          <button className="border border-[#5a6a7a] hover:border-white text-white text-xs px-3 py-1.5 rounded flex items-center gap-2">
            🌐 English
          </button>
          <button className="border border-[#5a6a7a] hover:border-white text-white text-xs px-3 py-1.5 rounded flex items-center gap-2">
            ₹ INR - Indian Rupee
          </button>
          <button className="border border-[#5a6a7a] hover:border-white text-white text-xs px-3 py-1.5 rounded flex items-center gap-2">
            🇮🇳 India
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#131921] text-[#999] text-xs">
        <div className="max-w-[1500px] mx-auto px-8 py-4 flex flex-wrap items-center justify-center gap-3">
          {["Conditions of Use", "Privacy Notice", "Your Ads Privacy Choices", "Interest-Based Ads Notice", "© 2024, MiniAmazon.com, Inc. or its affiliates"].map((item, i) => (
            <span key={i} className={i < 4 ? "hover:text-white hover:underline cursor-pointer" : ""}>{item}</span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
