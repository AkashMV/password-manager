import React, { useState } from 'react';
import { FiEdit, FiEye } from 'react-icons/fi';
import MasterKeyModal from '@renderer/modals/MasterKeyModal';
import EditPasswordModal from '@renderer/modals/EditPasswordModal';
import ErrorModal from '@renderer/modals/ErrorModal';
import SuccessModal from '@renderer/modals/SuccessModal';

interface Password {
  id: number
  service: string
  user_name: string
  password: string
}

interface PasswordComponentProps {
  password: Password;
  refreshPasswords: () => void
}

const PasswordComponent = ({ password, refreshPasswords }: PasswordComponentProps): JSX.Element => {
  const [showMasterKeyModal, setShowMasterKeyModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [message, setMessage] = useState("");
  const [viewOrEdit, setViewOrEdit] = useState("view")
  const [isPasswordDisplayed, setIsPasswordDisplayed] = useState(false)

  const closeSuccessModal = ():void => {
    setShowSuccessModal(false)
    
  }


// Edit Password Modal Functions

  const handleUpdateSuccess = ():void => {
    setShowEditPasswordModal(false)
    setMessage("Password Details Updated Successfully")
    setShowSuccessModal(true)
    refreshPasswords()
  }


  const closePasswordModal = (): void => {
    setShowEditPasswordModal(false);
  };


  // Master Key Modal Functions
  const handleEditClick = (): void => {
    setViewOrEdit("edit")
    setShowMasterKeyModal(true);
    
  };

  //once key is verified, the option to edit the password is displayed
  const onEditVerified = (): void => {
    setShowMasterKeyModal(false);
    setShowEditPasswordModal(true);
    setMessage('');
  };


  //if the password is currently displayed, hide it and vice versa
  const handleViewClick = (): void => {
    console.log(password.user_name, "simba")
    if(isPasswordDisplayed){
      setShowDetails(false)
      setIsPasswordDisplayed(false)
    }else{
    setViewOrEdit("view")
    setShowMasterKeyModal(true);
    }
  };

  //once key is verified, details of the password is displayed
  const onViewVerified = (): void => {
    setShowMasterKeyModal(false);
    setShowDetails(true);
    setIsPasswordDisplayed(true)
    setMessage('');
  };


  // if the master key given is incorrect
  const onDeclined = (): void => {
    setShowMasterKeyModal(false);
    setMessage('Master Key Verification failed');
    setShowErrorModal(true);
  };



  //close modals
  const closeMasterKeyModal = (): void => {
    setMessage('');
    setShowMasterKeyModal(false);
  };

  const closeErrorModal = (): void => {
    setMessage('');
    setShowErrorModal(false);
  };



  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-md relative">
      <div className="absolute top-2 left-2">
        <FiEdit
          className="text-white cursor-pointer"
          onClick={handleEditClick}
        />
      </div>
      <div className="absolute top-2 right-2">
        <FiEye
          className="text-white cursor-pointer bg-fuschia-500"
          onClick={handleViewClick}
        />
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{password.service}</h3>
      <p className="mb-2 text-white">Username: {showDetails ? password.user_name: '••••••••'}</p>
      <p className="text-white">
        Password: {showDetails ? password.password : '••••••••'}
      </p>
      {showMasterKeyModal && (
        <MasterKeyModal
          onClose={closeMasterKeyModal}
          onDeclined={onDeclined}
          handleView={onViewVerified}
          handleEdit={onEditVerified}
          operation = {viewOrEdit}
        />
      )}
      {showEditPasswordModal && (
        <EditPasswordModal
          onClose={closePasswordModal}
          userPassword={password}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      {showErrorModal && (
        <ErrorModal errorMessage={message} onClose={closeErrorModal} />
      )}
      {showSuccessModal && (<SuccessModal successMessage={message} onClose={closeSuccessModal} />)}
    </div>
  );
};

export default PasswordComponent;
