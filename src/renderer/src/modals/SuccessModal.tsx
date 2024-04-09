import React from 'react'

interface ErrorModalProps {
  successMessage: string;
  onClose: () => void;
}

const SuccessModal: React.FC<ErrorModalProps> = ({ successMessage, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-6 z-10">
        <h2 className="text-xl font-bold mb-4">Success</h2>
        <p className="mb-4">{successMessage}</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default SuccessModal
