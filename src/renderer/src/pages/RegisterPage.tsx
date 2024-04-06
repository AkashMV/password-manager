import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorModal from '@renderer/modals/ErrorModal'
import SuccessModal from '@renderer/modals/SuccessModal'
import validator from 'validator'

const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate()
  // State for form fields
  const [userName, setUserName] = useState('')
  const [masterKey, setMasterKey] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [message, setMessage] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    switch (name) {
      case 'userName':
        setUserName(value)
        break
      case 'masterKey':
        setMasterKey(value)
        break
      case 'firstName':
        setFirstName(value)
        break
      case 'lastName':
        setLastName(value)
        break
      default:
        break
    }
  }


  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault() // Prevent default form submission

    let validationErrors = 3

    if(userName.length < 4){
      setMessage("The master key must be atleast 4 characters long")
      setShowErrorModal(true)
    }else{
      validationErrors--
    }
    if(masterKey.length < 8){
      setMessage("The master key must be atleast 8 characters long")
      setShowErrorModal(true)
    }else{
      validationErrors--
    }

    

    if(!validator.isAlphanumeric(userName)){
      setMessage("Username must not contain special characters")
      setShowErrorModal(true)
    }else{
      validationErrors--
    }
    

    console.log(validationErrors)
    if(validationErrors == 0){
      window.electron.ipcRenderer
        .invoke('register-account', { userName, masterKey, firstName, lastName })
        .then((response) => {
          if (response.success) {
            setMessage('User registration success')
            setShowSuccessModal(true)
          } else {
            setMessage(response.message)
            setShowErrorModal(true)
          }
        })
        .catch((error) => {
          console.log('Error sending registration request', error)
          setMessage("Error while registering the account")
          setShowErrorModal(true)
        })
      }
  }

  const generateMasterKey = ():void =>{
    window.electron.ipcRenderer.invoke('generate-password')
    .then((response)=>{
      setMasterKey(response)
    })
    .catch((err)=>{
      console.log("Error", err)
    })
  }

  const closeModal = (): void => {
    setShowErrorModal(false)
    setMessage('')
  }

  const closeSuccessModal = (): void => {
    setShowSuccessModal(false)
    setMessage('')
    navigate("/")
  }

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-950">
      <div className="p-10 bg-zinc-900 rounded-lg shadow-xl w-96">
        <div className="flex justify-center mb-6 text-5xl font-bold text-slate-400">👁️Spy</div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-white text-sm font-bold mb-2">
              Username
            </label>
            <input
              name="userName"
              type="text"
              id="userName"
              value={userName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="masterKey" className="block text-white text-sm font-bold mb-2">
              Master Key
            </label>
            <div className="flex">
              <input
                name="masterKey"
                type="text"
                id="masterKey"
                value={masterKey}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                type="button"
                onClick={generateMasterKey}
                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Generate
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-white text-sm font-bold mb-2">
              First name<span>(optional)</span>
            </label>
            <input
              name="firstName"
              type="text"
              id="firstName"
              value={firstName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-white text-sm font-bold mb-2">
              Last Name <span>(optional)</span>
            </label>
            <input
              name="lastName"
              type="text"
              id="lastName"
              value={lastName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="text-center mb-4">
            <p className="text-xs text-red-500">
              Already have an account?{' '}
              <Link to="/" className="hover:text-red-800">
                Login
              </Link>
            </p>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-lime-300 hover:bg-lime-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>
        </form>
      </div>
      {showErrorModal && (<ErrorModal errorMessage={message} onClose={closeModal} />)}
      {showSuccessModal && (<SuccessModal successMessage={message} onClose={closeSuccessModal} />)}
    </div>
  )
}

export default RegisterPage
