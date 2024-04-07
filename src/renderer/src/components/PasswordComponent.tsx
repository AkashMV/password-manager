import React from 'react'

interface PasswordComponentProps {
  password: Password
}

const PasswordComponent = ({ password }: PasswordComponentProps): JSX.Element => {
  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2 text-white">{password.service}</h3>
      <p className="mb-2 text-white">Username: {password.username}</p>
      <p className="text-white">Password: {password.password}</p>
    </div>
  )
}

export default PasswordComponent