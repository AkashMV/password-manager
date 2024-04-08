// LocalStorage.tsx
import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import PasswordComponent from '@renderer/components/PasswordComponent'
import PasswordModal from '@renderer/modals/EditPasswordModal'
import { AuthContext } from '@renderer/utils/AuthContext'
import ErrorModal from '@renderer/modals/ErrorModal'

interface Password {
  id: number
  service: string
  username: string
  password: string
}

const LocalStorage = (): JSX.Element => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const userId = user?.id
  const [passwords, setPasswords] = useState<Password[]>([])
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [showErrorModal, setShowErrorModal] = useState(false)

  // Fetch passwords from the database on component mount
  useEffect(() => {
    fetchPasswords()
  }, [])

  const fetchPasswords = (): void => {
    // Make an IPC call to fetch passwords from the database
    window.electron.ipcRenderer.invoke('fetch-passwords', { userId })
      .then((response) => {
        if (response.success) {
          console.log(response.passwords)
          setPasswords(response.passwords)
        } else {
          setMessage(response.message)
          setShowErrorModal(true)
          navigate("/dashboard")
        }
      })
  }

  const openModal = (): void => {
    setShowModal(true)
  }

  const closeModal = (): void => {
    setShowModal(false)
  }

  const closeErrorModal = (): void => {
    setShowErrorModal(false)
  }

  const addPassword = (newPassword: Password): void => {
    // Make an IPC call to add the new password to the database
    window.electron.ipcRenderer.invoke('add-password', newPassword).then(() => {
      fetchPasswords() // Refresh the passwords after adding a new one
      closeModal()
    })
  }

  const deletePassword = (passwordId: number): void => {
    // Make an IPC call to delete the password from the database
    window.electron.ipcRenderer.invoke('delete-password', passwordId).then(() => {
      fetchPasswords() // Refresh the passwords after deleting one
    })
  }

  const updatePassword = (updatedPassword: Password): void => {
    // Make an IPC call to update the password in the database
    window.electron.ipcRenderer.invoke('update-password', updatedPassword).then(() => {
      fetchPasswords() // Refresh the passwords after updating one
    })
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="bg-zinc-900 py-4">
        <div className="container mx-auto px-4 flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-white hover:text-lime-300 mr-4"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Your Local Passwords</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {passwords.map((password) => (
            <PasswordComponent
              key={password.id}
              password={password}
            />
          ))}
          <div
            className="bg-zinc-800 p-6 rounded-lg shadow-md flex items-center justify-center cursor-pointer"
            onClick={openModal}
          >
            <span className="text-4xl">+</span>
          </div>
        </div>
      </main>
      {showModal && <PasswordModal onClose={closeModal} onSubmit={addPassword} />}
      {showErrorModal && (<ErrorModal errorMessage={message} onClose={closeErrorModal} />)}
    </div>
  )
}

export default LocalStorage
