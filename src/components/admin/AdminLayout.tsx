import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  Image,
  FolderOpen,
  Flag,
  Settings,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const location = useLocation()
  const { signOut } = useAuth()

  const menuItems = [
    { path: '/admin', icon: <Home />, label: 'Dashboard' },
    { path: '/admin/users', icon: <Users />, label: 'Users' },
    { path: '/admin/artworks', icon: <Image />, label: 'Artworks' },
    { path: '/admin/collections', icon: <FolderOpen />, label: 'Collections' },
    { path: '/admin/reports', icon: <Flag />, label: 'Reports' },
    { path: '/admin/settings', icon: <Settings />, label: 'Settings' },
  ]

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: isCollapsed ? 80 : 240 }}
        animate={{ width: isCollapsed ? 80 : 240 }}
        className="bg-gray-800 text-white"
      >
        <div className="p-4 flex justify-between items-center">
          {!isCollapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-4 hover:bg-gray-700 ${
                location.pathname === item.path ? 'bg-gray-700' : ''
              }`}
            >
              <span className="w-6 h-6">{item.icon}</span>
              {!isCollapsed && <span className="ml-4">{item.label}</span>}
            </Link>
          ))}
          <button
            onClick={signOut}
            className="flex items-center w-full p-4 hover:bg-gray-700"
          >
            <span className="w-6 h-6">
              <LogOut />
            </span>
            {!isCollapsed && <span className="ml-4">Logout</span>}
          </button>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gray-800 text-white p-4">
          <button className="p-2 hover:bg-gray-700 rounded-lg">
            <Menu />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
