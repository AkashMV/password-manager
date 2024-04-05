import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const LoginPage = (): JSX.Element => {
  const [name, setName] = useState<string>('')
  const [masterKey, setMasterKey] = useState<string>('')

  useEffect(() => {
    // Set focus on the username input field after the component mounts
    const usernameInput = document.getElementById('userName');
    if (usernameInput) {
      usernameInput.focus();
    }
  }, []);

  // Handle form input changes with TypeScript type for the event
  const handleInputChange = (e): void => {
    const { name, value } = e.target
    switch (name) {
      case 'username':
        setName(value)
        break
      case 'masterKey':
        setMasterKey(value)
        break
      default:
        break
    }
  }

  // Handle form submission with TypeScript type for the event
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault() // Correctly prevent the default form submission
    // Send login data to the Electron backend
    window.electron.ipcRenderer.send('--testing', { name, masterKey }) // Corrected IPC channel name
    // Listen for login response
    window.electron.ipcRenderer.once('login-user-response', (event, success) => {
      if (success) {
        console.log('ds')
        // Redirect to dashboard as needed
      } else {
        console.log('momos');
      }
    })
  }
  return (
    <div className="flex items-center justify-center h-screen bg-zinc-950">
      <div className="p-10 bg-zinc-900 rounded-lg shadow-xl">
        <div className="flex justify-center mb-6 text-5xl font-bold text-slate-400">👁️Spy</div>
        <form onSubmit={handleSubmit}>
          {' '}
          <div className="mb-4">
            <label htmlFor="username" className="block text-white text-sm font-bold mb-2">
              Username
            </label>
            <input
              name="username"
              type="text"
              id="username"
              value={name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-white text-sm font-bold mb-2">
              Master Key
            </label>
            <input
              name="masterKey"
              type="password"
              id="masterKey"
              value={masterKey}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="text-center mb-6">
            <p className="text-xs text-red-500">
              First time user? {' '}
              <Link to="/register" className="hover:text-red-800">
                Create an account
              </Link>
            </p>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-lime-300 hover:bg-lime-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
