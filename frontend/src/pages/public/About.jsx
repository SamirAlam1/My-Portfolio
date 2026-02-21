import { useTheme } from "../../context/ThemeContext";

const About = () => {
  const { isDark } = useTheme();

  const infoItems = [
    { label: "Location", value: "Ankleshwar, Gujarat, India", icon: "📍" },
    { label: "Experience", value: "0 Years (Student)", icon: "💼" },
    { label: "Availability", value: "Open to work", icon: "✅" },
    { label: "Languages", value: "English, Hindi", icon: "🌐" },
  ];

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 animate-fade-in">
          <h1 className="section-title">About Me</h1>
          <p className="section-subtitle">A little bit about who I am</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* ── Avatar ─────────────────────────────── */}
          <div className="animate-slide-up flex justify-center">
            <div className="relative">
              {/* Image box */}
              <div
                className={`w-72 h-72 rounded-3xl overflow-hidden border-2 ${
                  isDark ? "border-violet-500/30" : "border-violet-200"
                }`}
                style={{
                  boxShadow: isDark
                    ? "0 0 60px rgba(124,58,237,0.2)"
                    : "0 0 60px rgba(124,58,237,0.1)",
                }}
              >
                <img
                  src="/avatar.jpg"
                  alt="Samir"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    // Fallback to emoji if image not found
                    e.target.style.display = "none";
                    e.target.parentElement.classList.add(
                      "flex",
                      "items-center",
                      "justify-center",
                      "text-8xl",
                    );
                    e.target.parentElement.innerHTML = "👨‍💻";
                  }}
                />
              </div>

              {/* Floating badge */}
              <div
                className={`absolute -bottom-4 -right-4 card px-4 py-3 text-sm ${isDark ? "" : "shadow-lg"}`}
              >
                <p
                  className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Currently on
                </p>
                <p className="font-bold gradient-text">Portfolio CMS 🚀</p>
              </div>

              {/* Decorative dots */}
              <div
                className="absolute -top-4 -left-4 w-8 h-8 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                }}
              />
              <div
                className="absolute -top-2 -left-2 w-4 h-4 rounded-full opacity-50"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                }}
              />
            </div>
          </div>

          {/* ── Bio ────────────────────────────────── */}
          <div className="space-y-5 animate-fade-in">
            <p
              className={`text-lg leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Hey there! I'm Samir Alam a passionate{" "}
              <span className="gradient-text font-bold">
                Full Stack MERN Developer
              </span>{" "}
              and IT undergraduate who enjoys building modern, scalable web
              applications.
            </p>
            <p
              className={`leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              I love transforming ideas into clean, user-friendly digital
              experiences while continuously learning and improving through
              hands-on projects.
            </p>
            <p
              className={`leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              When I'm not coding, you'll find me contributing to open source,
              writing tech articles, or exploring new hiking trails.
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {infoItems.map(({ label, value, icon }) => (
                <div
                  key={label}
                  className={`rounded-xl p-4 border transition-all ${
                    isDark
                      ? "bg-[#16162e]/60 border-violet-500/10 hover:border-violet-500/30"
                      : "bg-violet-50/60 border-violet-200 hover:border-violet-400"
                  }`}
                >
                  <p
                    className={`text-xs uppercase tracking-wide mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {icon} {label}
                  </p>
                  <p
                    className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                🐙 GitHub
              </a>
              {/* <a href="#" className="btn-secondary">📄 Download CV</a> */}
              <a
                href="/resume.pdf"
                download="Resume.pdf"
                className="btn-secondary"
              >
                📄 Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
