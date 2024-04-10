import React, { useState, useContext } from 'react'
import ErrorModal from './ErrorModal'
import { AuthContext } from '@renderer/utils/AuthContext'

interface Password {
  id: number
  service: string
  user_name: string
  password: string
}

interface PasswordModalProps {
  userPassword: Password
  onClose: () => void
  onUpdateSuccess: () => void
}

const EditPasswordModal = ({ userPassword, onClose, onUpdateSuccess }: PasswordModalProps): JSX.Element => {
  const [service, setService] = useState(userPassword.service)
  const [username, setUsername] = useState(userPassword.user_name)
  const [password, setPassword] = useState(userPassword.password)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [message, setMessage] = useState("")
  const {user} = useContext(AuthContext)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>):void => {
    e.preventDefault()
    if(password.length < 1){
      setMessage("Password must not be empty")
      setShowErrorModal(true)
      return
    }else if(service.length < 1){
      setMessage("Service must not be empty")
      setShowErrorModal(true)
      return
    }else if(username.length < 1){
      setMessage("username must not be empty")
      setShowErrorModal(true)
      return
    }else{
      const passwordObject = {
        user_id: user?.id,
        id:userPassword.id,
        service:service,
        username: username,
        password: password
      }
      window.electron.ipcRenderer.invoke("update-password", {passwordObject})
        .then((response)=>{
          if(response.success){
            onUpdateSuccess()
          }else{
            setMessage(response.message)
            setShowErrorModal(true)
          }
        })
    }
  }
  

  const closeErrorModal = ():void =>{
    setShowErrorModal(false)
  }

  const generatePassword = ():void =>{
    window.electron.ipcRenderer.invoke('generate-password')
    .then((response)=>{
      setPassword(response)
    })
    .catch((err)=>{
      console.log("Error", err)
      setMessage("Error Generating Password")
      setShowErrorModal(true)
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-zinc-800 rounded-lg p-6 z-10 text-white">
        <h2 className="text-xl font-bold mb-4">View/Edit Password</h2>
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
              className="w-full px-3 py-2 border rounded text-black"
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
              className="w-full px-3 py-2 border rounded  text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password:
            </label>
            <div className="flex">
              <input
                type="text"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded  text-black"
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
            <button type="submit" className="px-4 py-2 bg-lime-300 hover:bg-lime-500 text-black rounded">
              Save
            </button>
          </div>
        </form>
      </div>
      {showErrorModal && (<ErrorModal errorMessage={message} onClose={closeErrorModal} />)}
    </div>
  )
}

export default EditPasswordModal