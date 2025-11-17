import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import sidebarAdmin from "@/utils/sidebar-admin.json";
import sidebarGuru from "@/utils/sidebar-guru.json";
import sidebarSiswa from "@/utils/sidebar-siswa.json";
import { 
  X, 
  ChevronDown, 
  ChevronRight,
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Briefcase,
  BookOpen, 
  Check,
  Coins
} from "lucide-react";

interface SidebarProps {
  toggleSidebar?: () => void;
  isOpen?: boolean;
  userRole: 'admin' | 'guru' | 'siswa';
}

interface MenuItem {
  type: string;
  title: string;
  link?: string;
  icon?: string;
  children?: MenuItem[];
}

// Icon mapping
const iconMap: { [key: string]: any } = {
  "ti ti-layout-dashboard": LayoutDashboard,
  "ti ti-building ": Building2,
  "ti ti-users": Users,
  "ti ti-id-badge": Settings,
  "ti ti-briefcase": Briefcase,
  "ti ti-notebook": BookOpen ,
  "ti ti-check": Check,
  "ti ti-coins": Coins,
};

const Sidebar = ({ toggleSidebar, isOpen = true, userRole }: SidebarProps) => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Pilih sidebar menu berdasarkan role
  const getSidebarMenu = (): MenuItem[] => {
    switch (userRole) {
      case 'admin':
        return sidebarAdmin as MenuItem[];
      case 'guru':
        return sidebarGuru as MenuItem[];
      case 'siswa':
        return sidebarSiswa as MenuItem[];
      default:
        return [];
    }
  };

  const sidebarMenu = getSidebarMenu();

  // Helper: build full link dengan prefix role
  const buildLink = (link?: string) => {
    if (!link) return "#";
    return `/${userRole}/${link}`;
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const renderIcon = (iconName?: string, isActive?: boolean, isHover?: boolean) => {
    if (!iconName) return null;
    const IconComponent = iconMap[iconName];
    if (!IconComponent) return null;
    
    return (
      <IconComponent 
        className={`w-5 h-5 transition-colors ${
          isActive ? "text-white" : "text-cyan-500 group-hover:text-white"
        }`} 
      />
    );
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-transform duration-300 z-50 w-64 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } xl:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleSidebar}
            className="xl:hidden ml-auto p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-[#970747]" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          <ul className="space-y-1">
            {sidebarMenu.map((menu: MenuItem, index: number) => {
              // Section Header
              if (menu.type === "section") {
                return (
                  <li key={index} className="pt-4 pb-2 px-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {menu.title}
                    </span>
                  </li>
                );
              } 
              
              // Single Menu Item
              else if (menu.type === "item") {
                const fullLink = buildLink(menu.link);
                const isActive = pathname === fullLink;
                
                return (
                  <li key={index}>
                    <Link
                      href={fullLink}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-cyan-500 text-white font-medium"
                          : "text-cyan-500 hover:bg-cyan-500 hover:text-white"
                      }`}
                    >
                      {renderIcon(menu.icon, isActive)}
                      <span className="flex-1">{menu.title}</span>
                    </Link>
                  </li>
                );
              } 
              else if (menu.type === "dropdown") {
                const isOpen = openDropdown === index;
                
                return (
                  <li key={index}>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isOpen
                          ? "bg-[#970747] text-white"
                          : "text-[#970747] hover:bg-[#970747] hover:text-white"
                      }`}
                    >
                      {renderIcon(menu.icon, isOpen)}
                      <span className="flex-1 text-left">{menu.title}</span>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-white" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#970747] group-hover:text-white transition-colors" />
                      )}
                    </button>

                    {isOpen && menu.children && (
                      <ul className="mt-1 ml-4 pl-4 border-l-2 border-[#970747]/20 space-y-1">
                        {menu.children.map((child: MenuItem, childIndex: number) => {
                          const fullChildLink = buildLink(child.link);
                          const isChildActive = pathname === fullChildLink;
                          
                          return (
                            <li key={childIndex}>
                              <Link
                                href={fullChildLink}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                                  isChildActive
                                    ? "bg-[#970747] text-white font-medium"
                                    : "text-[#970747] hover:bg-[#970747] hover:text-white"
                                }`}
                              >
                                {renderIcon(child.icon, isChildActive)}
                                <span className="text-sm">{child.title}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }
              
              return null;
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;