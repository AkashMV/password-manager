import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorModal from '@renderer/modals/ErrorModal'
import { AuthContext } from '@renderer/utils/AuthContext'

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate()
  const [userName, setName] = useState<string>('')
  const [masterKey, setMasterKey] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const {user, setUser} = useContext(AuthContext)

console.log(user)
  // Handle form input changes with TypeScript type for the event
  const handleInputChange = (e): void => {
    const { name, value } = e.target
    switch (name) {
      case 'username':
        setName(value)
        break
      case 'masterKey':
        setMasterKey(value)
        break
      default:
        break
    }
  }

  // Handle form submission with TypeScript type for the event
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault(); // Correctly prevent the default form submission
  
    let validationErrors = 2;
    if (userName.length < 1) {
      setMessage("Username must not be blank");
      setShowErrorModal(true);
    } else {
      validationErrors--;
    }
    if (masterKey.length < 1) {
      setMessage("Master Key must not be blank");
      setShowErrorModal(true);
    } else {
      validationErrors--;
    }
  
    // Send login data to the Electron backend if there are no errors
    if (validationErrors === 0) {
      window.electron.ipcRenderer
        .invoke('verify-user', { userName, masterKey })
        .then((response) => {
          if (response.success) {
            const userData = {
              id: response.user.id,
              username: response.user.username,
              cloudId: response.user.cloudId,
              cloudEnabled: response.user.cloud_enabled
            };
            if (userData.cloudEnabled) {
              window.electron.ipcRenderer.invoke("login-cloud", { cloudId: userData.cloudId })
                .then((response) => {
                  if (response.success) {
                    console.log(response.message);
                    setUser(userData);
                    console.log(userData);
                    navigate("/dashboard");
                  } else {
                    console.log(response.message);
                    userData.cloudEnabled = false;
                    window.electron.ipcRenderer.invoke("update-cloud-integration", { userId: userData.id, cloudEnabled: userData.cloudEnabled })
                      .then((response) => {
                        console.log(response);
                        setUser(userData);
                        console.log(userData);
                        navigate("/dashboard");
                      })
                      .catch((error) => {
                        console.log('Error updating cloud integration', error);
                        setMessage("An error occurred while updating cloud integration");
                        setShowErrorModal(true);
                      });
                  }
                })
                .catch((error) => {
                  console.log('Error logging into cloud', error);
                  setMessage("An error occurred while logging into cloud");
                  setShowErrorModal(true);
                });
            } else {
              setUser(userData);
              console.log(userData);
              navigate("/dashboard");
            }
          } else {
            setMessage(response.message);
            setShowErrorModal(true);
          }
        })
        .catch((error) => {
          console.log('Error sending Login request', error);
          setMessage("An error occurred while logging in");
          setShowErrorModal(true);
        });
    }
  };
  

    const closeModal = (): void => {
      setShowErrorModal(false)
      setMessage('')
    }

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-950">
      <div className="p-10 bg-zinc-900 rounded-lg shadow-xl">
        <div className="flex justify-center mb-6 text-5xl font-bold text-slate-400">👁️Spy</div>
        <form onSubmit={handleSubmit}>
          {' '}
          <div className="mb-4">
            <label htmlFor="username" className="block text-white text-sm font-bold mb-2">
              Username
            </label>
            <input
              name="username"
              type="text"
              id="username"
              value={userName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-white text-sm font-bold mb-2">
              Master Key
            </label>
            <input
              name="masterKey"
              type="password"
              id="masterKey"
              value={masterKey}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="text-center mb-6">
            <p className="text-xs text-red-500">
              First time user? {' '}
              <Link to="/register" className="hover:text-red-800">
                Create an account
              </Link>
            </p>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-lime-300 hover:bg-lime-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
      {showErrorModal && (<ErrorModal errorMessage={message} onClose={closeModal} />)}
    </div>
  )
}

export default LoginPage
