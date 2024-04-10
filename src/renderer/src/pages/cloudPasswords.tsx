// LocalStorage.tsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import CloudPassowrdComponent from "@renderer/components/CloudPasswordComponent"
import { AuthContext } from '@renderer/utils/AuthContext';
import ErrorModal from '@renderer/modals/ErrorModal';
import AddCloudPasswordModal from '@renderer/modals/AddCloudPasswordModal';
import { useTheme } from '@renderer/utils/ThemeContext';

interface Password {
  id: number;
  service: string;
  user_name: string;
  password: string;
}

const CloudStorage = (): JSX.Element => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userId = user?.cloudId;
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [message, setMessage] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showAddPasswordModal, setShowAddPasswwordModal] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = (): void => {
    window.electron.ipcRenderer.invoke('fetch-cloud-passwords', { userId })
      .then((response) => {
        if (response.success) {
          setPasswords(response.passwords);
        } else {
          setMessage(response.message);
          setShowErrorModal(true);
          navigate("/dashboard");
        }
      });
  };

  const closeErrorModal = (): void => {
    setShowErrorModal(false);
  };

  const openShowPasswordModal = (): void => {
    setShowAddPasswwordModal(true);
  };

  const closeAddPasswordModal = (): void => {
    setShowAddPasswwordModal(false);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-100'} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <header className={`${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-800'} py-4`}>
        <div className="container mx-auto px-4 flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex items-center ${theme === 'dark' ? 'text-white hover:text-lime-300' : 'text-black hover:text-lime-600'} mr-4`}
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
            <CloudPassowrdComponent
              key={password.id}
              password={password}
              refreshPasswords={fetchPasswords}
            />
          ))}
          <div
            className={`bg-zinc-800 p-6 rounded-lg shadow-md flex items-center justify-center cursor-pointer ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`}
            onClick={openShowPasswordModal}
          >
            <span className="text-4xl">+</span>
          </div>
        </div>
      </main>
      {showAddPasswordModal && (<AddCloudPasswordModal onClose={closeAddPasswordModal} refreshPasswords={fetchPasswords}/>)}
      {showErrorModal && (<ErrorModal errorMessage={message} onClose={closeErrorModal} />)}
    </div>
  );
};

export default CloudStorage;
