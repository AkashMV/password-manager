// LocalStorage.tsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PasswordComponent from '@renderer/components/PasswordComponent'
import PasswordModal from '@renderer/modals/PasswordModal'

interface Password {
  id: number
  service: string
  username: string
  password: string
}

const LocalStorage = (): JSX.Element => {
  const [passwords, setPasswords] = useState<Password[]>([])
  const [showModal, setShowModal] = useState(false)

  // Fetch passwords from the database on component mount
  useEffect(() => {
    fetchPasswords()
  }, [])

  const fetchPasswords = () => {
    // Make an IPC call to fetch passwords from the database
    window.electron.ipcRenderer.invoke('fetch-passwords').then((response) => {
      setPasswords(response.passwords)
    })
  }

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const addPassword = (newPassword: Password) => {
    // Make an IPC call to add the new password to the database
    window.electron.ipcRenderer.invoke('add-password', newPassword).then(() => {
      fetchPasswords() // Refresh the passwords after adding a new one
      closeModal()
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Local Passwords</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passwords.map((password) => (
          <PasswordComponent key={password.id} password={password} />
        ))}
        <div
          className="bg-zinc-800 p-6 rounded-lg shadow-md flex items-center justify-center cursor-pointer"
          onClick={openModal}
        >
          <span className="text-4xl">+</span>
        </div>
      </div>
      {showModal && <PasswordModal onClose={closeModal} onSubmit={addPassword} />}
    </div>
  )
}

export default LocalStorage
