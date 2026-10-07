import { BriefcaseIcon } from '@/components/ui/Icons.jsx';

export default function Header() {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <div className="brand">
          <span className="brand-mark"><BriefcaseIcon /></span>
          <span className="brand-name">JobCapture</span>
        </div>
        <span className="topbar-note">Roles shared by people we know</span>
      </div>
    </header>
  );
}
