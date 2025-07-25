import React, { useEffect, useCallback, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { jwtDecode } from "jwt-decode";
import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../components/icons"; 

//["super_admin","administrasi", "ktu", "kadep", "sekdep"]
const navItems = [
  {
    icon: <img src={GridIcon} alt="Grid Icon"/>,
    name: "Dashboard",
    path: "/dashboard",
    allowedRoles: ["super_admin", "administrasi", "ktu", "kadep", "sekdep", "dosen"]
  },
  // {
  //   icon: <img src={CalenderIcon} alt="Grid Icon"/>,
  //   name: "Calendar",
  //   path: "/calendar",
  //   allowedRoles: ["super_admin", "administrasi", "ktu", "kadep", "sekdep", "dosen"]
  // },
  // {
  //   icon: <img src={UserCircleIcon} alt="Grid Icon"/>,
  //   name: "User Profile",
  //   path: "/profile",
  //   allowedRoles: ["super_admin", "administrasi", "ktu", "kadep", "sekdep", "dosen"]
  // },
  // {
  //   name: "Forms",
  //   icon: <img src={ListIcon} alt="Grid Icon"/>,
  //   allowedRoles: ["super_admin", "administrasi", "ktu", "kadep", "sekdep", "dosen"],
  //   subItems: [
  //     // { name: "Form Elements", path: "/form-elements", pro: false },
  //     { name: "Form Surat Masuk", path: "/form-surat-masuk", pro: false },
  //     { name: "Form Surat Keluar", path: "/form-surat-keluar", pro: false },
  //   ],
  // },
  // {
  //   name: "Tables",
  //   icon: <img src={TableIcon} alt="Grid Icon"/>,
  //   allowedRoles: ["super_admin", "administrasi", "ktu", "kadep", "sekdep", "dosen"],
  //   subItems: [
  //     // { name: "Basic Tables", path: "/basic-tables", pro: false },
  //     { name: "Surat Masuk Tables", path: "/letter-in-tables", pro: false },
  //     { name: "Surat Keluar Tables", path: "/letter-out-tables", pro: false }
  //   ],
  // },
  {
    name: "Surat Masuk",
    icon: <img src={TableIcon} alt="Grid Icon"/>,
    allowedRoles: ["super_admin", "administrasi", "ktu", "kadep", "sekdep", "dosen"],
    subItems: [
      // { name: "Basic Tables", path: "/basic-tables", pro: false },
      { name: "Daftar Surat Masuk", path: "/letter-in-tables", pro: false },
      { name: "Input Surat Masuk", path: "/form-surat-masuk", pro: false, allowedRoles: ["super_admin", "administrasi"], },
      { name: "Arsip Surat Masuk", path: "/arsip-surat-masuk", pro: false }
    ],
  },
  {
    name: "Surat Keluar",
    icon: <img src={TableIcon} alt="Grid Icon"/>,
    allowedRoles: ["super_admin", "administrasi", "ktu", "kadep", "sekdep", "dosen"],
    subItems: [
      // { name: "Basic Tables", path: "/basic-tables", pro: false },
      { name: "Daftar Surat Keluar", path: "/letter-out-tables", pro: false },
      { name: "Input Surat Keluar", path: "/form-surat-keluar", pro: false, allowedRoles: ["super_admin", "administrasi"], },
      { name: "Input Arsip Surat Keluar", path: "/archive-surat-keluar", pro: false, allowedRoles: ["super_admin", "administrasi"], },
      { name: "Arsip Surat Keluar", path: "/arsip-surat-keluar", pro: false }
    ],
  },
  {
    name: "Data Master",
    icon: <img src={PlugInIcon} alt="Grid Icon"/>,
    allowedRoles: ["administrasi"],
    subItems: [
      // { name: "Basic Tables", path: "/basic-tables", pro: false },
      { name: "Pengguna", path: "/atur-pengguna", pro: false },
      { name: "Pegawai", path: "/atur-pegawai", pro: false, allowedRoles: ["super_admin", "administrasi"], },
      { name: "Klasifikasi Surat", path: "/atur-klasifikasi", pro: false },
       { name: "Tujuan Surat", path: "/atur-tujuan", pro: false },
       { name: "Tembusan Surat", path: "/atur-tembusan", pro: false },
    ],
  },
];

const othersItems = [
  // {
  //   icon: <img src={PlugInIcon} alt="Grid Icon"/>,
  //   name: "Authentication",
  //   subItems: [
  //     { name: "Sign In", path: "/signin", pro: false },
  //     { name: "Sign Up", path: "/signup", pro: false },
  //   ],
  // },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState(
    {}
  );
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items, menuType) => {
    let userRole = null;

    try {
      const token = localStorage.getItem("token");
      if (token) {
        const user = jwtDecode(token);
        userRole = user.role;
      }
    } catch (error) {
      console.error("Invalid token or decode error:", error);
    }

    const filteredItems = items.filter((item) => {
      return !item.allowedRoles || item.allowedRoles.includes(userRole);
    });

    return (
    <ul className="flex flex-col gap-4">
      {filteredItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <img src={ChevronDownIcon} 
                    alt="Grid Icon"
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                        openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                          ? "rotate-180 text-brand-500"
                          : ""
                      }`}
                    />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems
                .filter(
                  (subItem) =>
                    !subItem.allowedRoles || subItem.allowedRoles.includes(userRole)
                )
                .map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
    )
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/E1 - Logo IPB University Vertical Departemen Warna-Lo.png"
                alt="Logo"
                // width={150}
                // height={60}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/E1 - Logo IPB University Vertical Departemen Putih-Lo.png"
                alt="Logo"
                // width={150}
                // height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/E1 - Logo IPB University Vertical Departemen Warna-Lo.png"
              alt="Logo"
              
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col h-full overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                    <img src={HorizontaLDots} alt="Grid Icon"/>
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            </nav>

            {/* <div className="mt-auto mb-6">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                    <img src={HorizontaLDots} alt="Grid Icon"/>
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          
        
      </div>
    </aside>
  );
};

export default AppSidebar;
