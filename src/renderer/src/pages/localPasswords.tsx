// LocalStorage.tsx
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import PasswordComponent from '@renderer/components/PasswordComponent'
import { AuthContext } from '@renderer/utils/AuthContext'
import ErrorModal from '@renderer/modals/ErrorModal'
import addPasswordModal from '@renderer/modals/AddPasswordModal'

interface Password {
  id: number
  service: string
  user_name: string
  password: string
}

const LocalStorage = (): JSX.Element => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const userId = user?.id
  const [passwords, setPasswords] = useState<Password[]>([])
  const [message, setMessage] = useState<string>('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showAddPasswordModal, setShowAddPasswwordModal] = useState(false)

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

  const closeErrorModal = (): void => {
    setShowErrorModal(false)
  }


  const openModal = ():void =>{
    setShowAddPasswwordModal(true)
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
              refreshPasswords = {fetchPasswords}
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
      {showAddPasswordModal && (<addPasswordModal errorMessage={message} onClose={closeErrorModal} />)}
      {showErrorModal && (<ErrorModal errorMessage={message} onClose={closeErrorModal} />)}
    </div>
  )
}

export default LocalStorage
