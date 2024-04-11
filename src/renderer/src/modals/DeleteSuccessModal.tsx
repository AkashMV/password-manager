import React from 'react'

interface ErrorModalProps {
  successMessage: string;
}

const DeleteSuccessModal: React.FC<ErrorModalProps> = ({ successMessage }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-6 z-10">
        <h2 className="text-xl font-bold mb-4">Success</h2>
        <p className="mb-4">{successMessage}</p>
      </div>
    </div>
  )
}

export default DeleteSuccessModal
