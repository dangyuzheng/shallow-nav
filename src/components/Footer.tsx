import { Compass } from 'lucide-react';

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Compass size={16} strokeWidth={1.8} />
          <span>浅途 Nav</span>
        </div>
        <p className="footer-text">精选优质站点，助你高效直达目标</p>
        <p className="footer-copy">&copy; {new Date().getFullYear()} 浅途 Nav. All rights reserved.</p>
      </div>
    </footer>
  );
}
