// DashBoard.tsx
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { AuthContext } from '@renderer/utils/AuthContext'
import { useTheme } from '@renderer/utils/ThemeContext'

const DashBoard = (): JSX.Element => {
  const navigate = useNavigate()
  const {user, setUser} = useContext(AuthContext)
  const {theme} = useTheme()

  console.log(user)
  const handleLogout = ():void => {
    // Perform any necessary logout actions (e.g., clearing user session)
    setUser(null)
    navigate('/')

  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-100'} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <header className={`${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-800'} py-4`}>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Welcome, {user?.username}</h1>
          <button
            onClick={handleLogout}
            className={`flex items-center ${theme === 'dark' ? 'text-white hover:text-lime-300' : 'text-black hover:text-lime-600'}`}
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className={`${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'} p-6 rounded-lg shadow-md`}>
            <h2 className="text-xl font-bold mb-4">View Local Passwords</h2>
            <p className="mb-4">Manage and view your locally stored passwords.</p>
            <Link
              to="/local-passwords"
              className="inline-block bg-lime-300 hover:bg-lime-500 text-black font-bold py-2 px-4 rounded"
            >
              View Local Passwords
            </Link>
          </section>
          <section className={`${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'} p-6 rounded-lg shadow-md`}>
            <h2 className="text-xl font-bold mb-4">View Cloud Passwords</h2>
            <p className="mb-4">Access and manage your passwords stored in the cloud.</p>
            <Link
              to="/cloud-passwords"
              className="inline-block bg-lime-300 hover:bg-lime-500 text-black font-bold py-2 px-4 rounded"
            >
              View Cloud Passwords
            </Link>
          </section>
          <section className={`${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'} p-6 rounded-lg shadow-md`}>
            <h2 className="text-xl font-bold mb-4">Get Breach Report</h2>
            <p className="mb-4">Check if any of your accounts have been compromised in a data breach.</p>
            <Link
              to="/breach-report"
              className="inline-block bg-lime-300 hover:bg-lime-500 text-black font-bold py-2 px-4 rounded"
            >
              Get Breach Report
            </Link>
          </section>
          <section className={`${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'} p-6 rounded-lg shadow-md`}>
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <p className="mb-4">Customize and manage your account settings.</p>
            <Link
              to="/settings"
              className="inline-block bg-lime-300 hover:bg-lime-500 text-black font-bold py-2 px-4 rounded"
            >
              Go to Settings
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}

export default DashBoard
