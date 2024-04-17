// Settings.tsx
import React, {useContext, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCloud, FiMoon, FiLogOut, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@renderer/utils/ThemeContext';
import { AuthContext } from '@renderer/utils/AuthContext';
import ErrorModal from '@renderer/modals/ErrorModal';
import SuccessModal from '@renderer/modals/SuccessModal';

const Settings = (): JSX.Element => {
  const navigate = useNavigate();
  const {user, setUser} = useContext(AuthContext)
  const [cloudIntegration, setCloudIntegration] = useState(user?.cloudEnabled || false);
  const { theme, toggleTheme } = useTheme();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [message, setMessage] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  

  const handleCloudIntegrationToggle = ():void => {
    const newCloudIntegration = !cloudIntegration
    setCloudIntegration(newCloudIntegration)
    console.log(newCloudIntegration)
    if(user){
      if(newCloudIntegration && !user.cloudId){
        window.electron.ipcRenderer.invoke("create-cloud-user", {userId:user.id, userName:user.username})
          .then((response)=>{
            console.log(response, "first time creation")
            const newCloudId = response.cloudId
            setUser({...user, cloudId:newCloudId})
          }).catch((error)=>{
            console.log("error occured:", error)
          })
      }
      window.electron.ipcRenderer.invoke("update-cloud-integration", {
        userId: user.id,
        cloudEnabled: newCloudIntegration
      })
        .then((response)=>{
          if(response.success){
            user.cloudEnabled = newCloudIntegration
          }
        })
        .catch((error)=>{
          console.log(error)
        })
    }
  };

  const handleDarkModeToggle = ():void => {
    toggleTheme();
  };

  const handleLogout = ():void => {
    setUser(null)
    navigate('/');
  };

  const handleDeleteUser = ():void => {
    window.electron.ipcRenderer.invoke("delete-user", {userId:user?.id})
      .then((response)=>{
        setMessage(response.message)
        if(response.success){
          setShowSuccessModal(true)
        }else{
          setShowErrorModal(true)
        }
      })
  };

  const closeSuccessModal = ():void=>{
    setUser(null)
    navigate("/")
    setShowSuccessModal(false)
  }

  const closeErrorModal = ():void => {
    setShowErrorModal(false)
  }



  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-100'} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <header className={`${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-800'} py-4`}>
        <div className="container mx-auto px-4">
          <Link to="/dashboard" className={`flex items-center ${theme === 'dark' ? 'text-white hover:text-lime-300' : 'text-black hover:text-lime-600'}`}>
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold mt-4">Settings</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiCloud className="mr-2" />
              <span>Cloud Integration</span>
            </div>
            <button
              className={`${
                cloudIntegration ? 'bg-lime-500' : 'bg-zinc-500'
              } relative inline-flex items-center h-6 rounded-full w-11`}
              onClick={handleCloudIntegrationToggle}
            >
              <span
                className={`${
                  cloudIntegration ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform ease-in-out duration-200`}
              ></span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiMoon className="mr-2" />
              <span>Dark Mode</span>
            </div>
            <button
              className={`${
                theme === 'dark' ? 'bg-lime-500' : 'bg-zinc-500'
              } relative inline-flex items-center h-6 rounded-full w-11`}
              onClick={handleDarkModeToggle}
            >
              <span
                className={`${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform ease-in-out duration-200`}
              ></span>
            </button>
          </div>
          <button
            className={`flex items-center ${theme === 'dark' ? 'text-white hover:text-lime-300' : 'text-black hover:text-lime-600'}`}
            onClick={handleLogout}
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
          <button
            className="flex items-center text-red-500 hover:text-red-600"
            onClick={handleDeleteUser}
          >
            <FiTrash2 className="mr-2" />
            Delete User
          </button>
        </div>
      </main>
      {showErrorModal && (<ErrorModal errorMessage={message} onClose={closeErrorModal} />)}
      {showSuccessModal && (<SuccessModal successMessage={message} onClose={closeSuccessModal} />)}
    </div>
  );
};

export default Settings;
