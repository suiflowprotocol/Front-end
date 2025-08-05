import { Link } from "react-router-dom";
import "./SidebarMenu.css";
import { useState } from "react";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>("trade"); // Default to "trade"

  const toggleDropdown = (menu: string | null, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveMenu(menu); // Set the clicked menu as active
    const currentDropdown = document.querySelector(`.dropdown3.${menu}.open3`);
    if (currentDropdown) {
      currentDropdown.classList.remove("open3");
    } else {
      document.querySelectorAll(".dropdown3.open3").forEach((dropdown) => dropdown.classList.remove("open3"));
      if (menu) {
        document.querySelector(`.dropdown3.${menu}`)?.classList.add("open3");
      }
    }
  };

  return (
    <div className={`sidebar-menu3 ${isOpen ? "open3" : ""}`}>
      <div className="sidebar-header3">
        <div className="logo-container3">
          <img src="https://i.meee.com.tw/SdliTGK.png" alt="Logo" className="logo-image" />
          <span className="logo-text">SEAL</span>
        </div>
        <button className="close-button3" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="16px" height="16px">
            <path
              fill="var(--text-color)"
              d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
            />
          </svg>
        </button>
      </div>
      <div className="sidebar-content3">
        <div className="menu-item3" onClick={(e) => toggleDropdown("trade", e)}>
          <div className={`menu-item-header3 ${activeMenu === "trade" ? "active" : ""}`}>
            <p className="chakra-text css-1sibxxu3">Trade</p>
            <svg className="dropdown-arrow" aria-hidden="true" fill="transparent" stroke="var(--text-secondary)" strokeWidth="2" width="12px" height="12px" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <div className="dropdown3 trade">
            <Link to="/" onClick={onClose} className="dropdown-item3">
              <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px" viewBox="0 0 24 24">
                <path d="M7 7h10v2H7zm10 4H7v2h10zm-3 4l4-4-4-4v3H7v2h7v3z" />
              </svg>
              Swap
            </Link>
          </div>
        </div>
        <div className="menu-item3" onClick={(e) => toggleDropdown("earn", e)}>
          <div className={`menu-item-header3 ${activeMenu === "earn" ? "active" : ""}`}>
            <p className="chakra-text css-1sibxxu3">Earn</p>
            <svg className="dropdown-arrow" aria-hidden="true" fill="transparent" stroke="var(--text-secondary)" strokeWidth="2" width="12px" height="12px" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <div className="dropdown3 earn">
            <Link to="/pool" onClick={onClose} className="dropdown-item3">
              <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px" viewBox="0 0 24 24">
                <path d="M4 8h16v2H4zm0 4h16v2H4zm0 4h16v2H4z" />
              </svg>
              Pools
            </Link>
          </div>
        </div>
        <div className="menu-item3" onClick={(e) => toggleDropdown("xseal", e)}>
          <Link to="/xseal" onClick={onClose} className={`menu-item-header3 ${activeMenu === "xseal" ? "active" : ""}`} style={{ textDecoration: 'none' }}>
            <p className="chakra-text css-1sibxxu3">xSEAL</p>
          </Link>
        </div>
        <div className="menu-item3" onClick={(e) => toggleDropdown("ico", e)}>
          <Link to="/ico" onClick={onClose} className={`menu-item-header3 ${activeMenu === "ico" ? "active" : ""}`} style={{ textDecoration: 'none' }}>
            <p className="chakra-text css-1sibxxu3">Ico</p>
          </Link>
        </div>
        <div className="menu-item3" onClick={(e) => toggleDropdown("bridge", e)}>
          <div className={`menu-item-header3 ${activeMenu === "bridge" ? "active" : ""}`}>
            <p className="chakra-text css-1sibxxu3">Bridge</p>
            <svg className="dropdown-arrow" aria-hidden="true" fill="transparent" stroke="var(--text-secondary)" strokeWidth="2" width="12px" height="12px" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <div className="dropdown3 bridge">
            <a href="https://bridge.sui.io/" target="_blank" rel="noopener noreferrer" className="dropdown-item3">
              <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px" viewBox="0 0 24 24">
                <path d="M3 12h6v2H3v-2zm18 0h-6v2h6v-2zm-9-6v12m-2-12h4v12h-4z" />
              </svg>
              Sui Bridge
            </a>
            <a href="https://bridge.cetus.zone/sui" target="_blank" rel="noopener noreferrer" className="dropdown-item3">
              <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 0 0-10 10h4a6 6 0 0 1 12 0h4a10 10 0 0 0-10-10z" />
              </svg>
              Wormhole
            </a>
          </div>
        </div>
        <div className="menu-item3" onClick={(e) => toggleDropdown("more", e)}>
          <div className={`menu-item-header3 ${activeMenu === "more" ? "active" : ""}`}>
            <p className="chakra-text css-1sibxxu3">More</p>
            <svg className="dropdown-arrow" aria-hidden="true" fill="transparent" stroke="var(--text-secondary)" strokeWidth="2" width="12px" height="12px" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <div className="dropdown3 more">
            <a href="#" className="dropdown-item3">
              <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px" viewBox="0 0 24 24">
                <path d="M4 4h16v2H4zm0 7h16v2H4zm0 7h16v2H4z" />
              </svg>
              Docs
            </a>
            <a href="#" className="dropdown-item3">
              <svg aria-hidden="true" fill="var(--text-secondary)" width="20px" height="20px" viewBox="0 0 24 24">
                <path d="M5 15h4v6H5zm6-4h4v10h-4zm6-6h4v16h-4z" />
              </svg>
              Leaderboard
            </a>
          </div>
        </div>
      </div>
      <div className="sidebar-footer3">
        <div className="chakra-stack3 css-q2safe3">
          <div className="chakra-stack3 css-chgbhg3">
            <div className="footer-text-container3">
              <p className="chakra-text3 css-vcvc473">RPC Node</p>
            </div>
            <div className="spacer3"></div>
            <div className="footer-text-right3">
              <p className="chakra-text3 css-ry2o2l3">Sui Official</p>
            </div>
            <div className="css-w6and63">
              <svg aria-hidden="true" fill="var(--text-secondary)" width="12px" height="12px">
                <use xlinkHref="#icon-icon_arrow"></use>
              </svg>
            </div>
          </div>
          <div className="chakra-stack3 css-chgbhg3">
            <div className="footer-text-container3">
              <p className="chakra-text3 css-vcvc473">Preferred Explorer</p>
            </div>
            <div className="spacer3"></div>
            <div className="footer-text-right3">
              <p className="chakra-text3 css-ry2o2l3">SuiVision</p>
            </div>
            <div className="css-w6and63">
              <svg aria-hidden="true" fill="var(--text-secondary)" width="12px" height="12px">
                <use xlinkHref="#icon-icon_arrow"></use>
              </svg>
            </div>
          </div>
        </div>
        <div className="social-buttons3">
          <div className="chakra-stack3 css-n3uhkm3">
            <div className="css-eorw493">
              <div className="css-03">
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="css-b42dtz3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg" alt="X" width="20px" height="20px" />
                </a>
              </div>
            </div>
            <div className="css-eorw493">
              <div className="css-03">
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="css-b42dtz3">
                  <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" alt="Discord" width="20px" height="20px" />
                </a>
              </div>
            </div>
            <div className="css-eorw493">
              <div className="css-03">
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="css-6w0v093">
                  <img src="https://www.svgrepo.com/show/343522/telegram-communication-chat-interaction-network-connection.svg" alt="Telegram" width="20px" height="20px" />
                </a>
              </div>
            </div>
            <div className="css-eorw493">
              <div className="css-03">
                <a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="css-b42dtz3">
                  <img src="https://www.svgrepo.com/show/354057/medium-icon.svg" alt="Medium" width="20px" height="20px" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarMenu;