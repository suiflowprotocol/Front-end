import { Link } from "react-router-dom";
import "./SidebarMenu.css";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  return (
    <div className={`sidebar-menu ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image1" />
          <span className="logo-text1">Seal</span>
        </div>
        <button className="close-button" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="24px" height="24px">
            <path
              fill="var(--text-color)"
              d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
            />
          </svg>
        </button>
      </div>
      <div className="sidebar-content">
        <div className="menu-item">
          <Link to="/" onClick={onClose}>
            <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px">
              <use xlinkHref="#icon-a-icon_swap2"></use>
            </svg>
            <span>Swap</span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/pool" onClick={onClose}>
            <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px">
              <use xlinkHref="#icon-icon_liquiditypools"></use>
            </svg>
            <span>Pool</span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/xseal" onClick={onClose}>
            <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px">
              <use xlinkHref="#icon-xseal"></use>
            </svg>
            <span>xSeal</span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/settings" onClick={onClose}>
            <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px">
              <use xlinkHref="#icon-icon_settings"></use>
            </svg>
            <span>Settings</span>
          </Link>
        </div>
      </div>
      <div className="social-buttons">
        <div className="chakra-stack css-n3uhkm">
          <div className="css-eorw49">
            <div className="css-0">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="css-b42dtz">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg" alt="X" width="20px" height="20px" />
              </a>
            </div>
          </div>
          <div className="css-eorw49">
            <div className="css-0">
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="css-b42dtz">
                <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" alt="Discord" width="20px" height="20px" />
              </a>
            </div>
          </div>
          <div className="css-eorw49">
            <div className="css-0">
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="css-6w0v09">
                <img src="https://images.seeklogo.com/logo-png/49/2/telegram-logo-png_seeklogo-490015.png" alt="Telegram" width="30px" height="30px" />
              </a>
            </div>
          </div>
          <div className="css-eorw49">
            <div className="css-0">
              <a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="css-b42dtz">
                <img src="https://www.svgrepo.com/show/354057/medium-icon.svg" alt="Medium" width="20px" height="20px" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarMenu;