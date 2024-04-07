// PasswordModal.tsx
import React, { useState } from 'react'

interface PasswordModalProps {
  onClose: () => void
  onSubmit: (password: Password) => void
}

const PasswordModal = ({ onClose, onSubmit }: PasswordModalProps): JSX.Element => {
  const [service, setService] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({ id: 0, service, username, password })
  }

  const generatePassword = () => {
    // Generate a random password
    const generatedPassword = Math.random().toString(36).slice(-8)
    setPassword(generatedPassword)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-6 z-10">
        <h2 className="text-xl font-bold mb-4">Add Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="service" className="block mb-2">
              Service:
            </label>
            <input
              type="text"
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password:
            </label>
            <div className="flex">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <button
                type="button"
                onClick={generatePassword}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Generate
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PasswordModal