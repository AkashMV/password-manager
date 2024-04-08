interface MasterKeyModalProps {
  onClose: () => void
  onVerified: () => void
}

const MasterKeyModal = ({ onClose, onVerified }: MasterKeyModalProps): JSX.Element => {
  const [masterKey, setMasterKey] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Perform master key verification logic here
    // If the master key is valid, call onVerified()
    // If the master key is invalid, display an error message
    onVerified()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-zinc-800 rounded-lg p-6 z-10 text-white">
        <h2 className="text-xl font-bold mb-4">Enter Master Key</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="masterKey" className="block mb-2">
              Master Key:
            </label>
            <input
              type="password"
              id="masterKey"
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
              className="w-full px-3 py-2 border rounded text-black"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-lime-300 hover:bg-lime-500 text-black rounded">
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MasterKeyModal