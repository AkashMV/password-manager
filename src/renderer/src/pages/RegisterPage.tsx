import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate()
  // State for form fields
  const [userName, setUserName] = useState('')
  const [masterKey, setMasterKey] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')


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

    window.electron.ipcRenderer
      .invoke('register-account', { userName, masterKey, firstName, lastName })
      .then((response) => {
        if (response.success) {
          console.log('bimbachi')
          navigate('/')
        } else {
          console.log('simbachi');
        }
      })
      .catch((error) => {
        console.log('Error sending registration request', error)
      })
  }

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-700">
      <div className="p-10 bg-gray-900 rounded-lg shadow-xl">
        <div className="flex justify-center mb-6 text-xl font-semibold text-white">👁️Spy</div>
        <form onSubmit={handleSubmit}>
          {' '}
          <div className="mb-6">
            <label htmlFor="userName" className="block text-white text-sm font-bold mb-2">
            username
            </label>
            <input
            name="userName"
            type="text"
            id="userName"
            value={userName}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-white text-sm font-bold mb-2">
              master key
            </label>
            <input
              name="masterKey" // Corrected to include name attribute
              type="password"
              id="masterKey"
              value={masterKey}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="firstName" className="block text-white text-sm font-bold mb-2">
              first name
            </label>
            <input
              name="firstName" // Corrected to include name attribute
              type="text"
              id="firstName"
              value={firstName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="lastName" className="block text-white text-sm font-bold mb-2">
              last name
            </label>
            <input
              name="lastName" // Corrected to include name attribute
              type="text"
              id="lastName"
              value={lastName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <p className="inline-block align-baseline font-bold  text-red-500">
            First time user?
            <span className=" hover:text-red-800">
              <Link
                to="/"
                className="inline-block align-baseline font-bold text-sm text-red-500 hover:text-red-800"
              >
                Create an account
              </Link>
            </span>
          </p>
          <div className="flex items-center justify-between">
            <button
              type="submit" // Corrected to use type="submit" for form submission
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
