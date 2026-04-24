export default function Footer() {
  return (
    <footer
      className="fixed bottom-0 inset-x-0 z-10 py-3 px-6 text-sm"
      style={{ background: 'rgba(120, 53, 15, 0.92)', backdropFilter: 'blur(8px)' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between text-amber-100">
        <span className="opacity-60 text-xs">© {new Date().getFullYear()} Wall of Support</span>
        <div className="flex items-center gap-5 text-xs">
          <a
            href="mailto:shauryakumar1709@gmail.com"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            ✉ Contact
          </a>
          <a
            href="https://github.com/ShauryaKumarr"
            target="_blank"
            rel="noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            GitHub
          </a>
          <a
            href="https://www.instagram.com/shaurya.kum"
            target="_blank"
            rel="noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
