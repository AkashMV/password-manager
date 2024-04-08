import React, { useState } from 'react'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import MasterKeyModal from '@renderer/modals/MasterKeyModal'
import PasswordModal from '@renderer/modals/EditPasswordModal'


interface Password {
  id: number
  service: string
  username: string
  password: string
}


interface PasswordComponentProps {
  password: Password
  onDelete: (passwordId: number) => void
  onUpdate: (updatedPassword: Password) => void
  onCreate: (newPassword: Password) => void
}

const PasswordComponent = ({ password, onDelete, onUpdate, onCreate }: PasswordComponentProps): JSX.Element => {
  const [showMasterKeyModal, setShowMasterKeyModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState<Password | null>(null)

  const openMasterKeyModal = (): void => {
    setShowMasterKeyModal(true)
  }

  const closeMasterKeyModal = (): void => {
    setShowMasterKeyModal(false)
  }

  const openPasswordModal = (): void => {
    setCurrentPassword(password)
    setShowPasswordModal(true)
  }

  const closePasswordModal = (): void => {
    setCurrentPassword(null)
    setShowPasswordModal(false)
  }

  const handleMasterKeyVerified = (): void => {
    openPasswordModal()
    closeMasterKeyModal()
  }

  const handleDelete = (): void => {
    onDelete(password.id)
  }

  const handleSave = (updatedPassword: Password): void => {
    if (currentPassword) {
      onUpdate(updatedPassword)
    } else {
      onCreate(updatedPassword)
    }
    closePasswordModal()
  }

  return (
    <div
      className="bg-zinc-800 p-6 rounded-lg shadow-md cursor-pointer"
      onClick={openMasterKeyModal}
    >
      <h3 className="text-xl font-bold mb-2 text-white">{password.service}</h3>
      <p className="mb-2 text-white">Username: {password.username}</p>
      <p className="text-white">Password: ••••••••</p>
      {showMasterKeyModal && (
        <MasterKeyModal
          onClose={closeMasterKeyModal}
          onVerified={handleMasterKeyVerified}
          onDelete={handleDelete}
        />
      )}
      {showPasswordModal && (
        <PasswordModal
          onClose={closePasswordModal}
          onSubmit={handleSave}
          initialPassword={currentPassword}
        />
      )}
    </div>
  )
}

export default PasswordComponent
