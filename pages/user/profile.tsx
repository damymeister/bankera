import { useEffect, useState } from 'react';
import '@/components/css/home.css';
import '@/components/css/forms.css';
import  '@/app/globals.css';
import Layout from '@/app/layoutPattern';
import '@/components/css/tailwind.css';
import { useSearchParams } from 'next/navigation';
import api_url from '@/lib/api_url';
import axios from 'axios';

const UserProfile = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const params = useSearchParams()

    useEffect(() => {
      const url = api_url('auth/user/profile')
      const GetProfile = async () => {
        try {
          const { data } = await axios.get(url, { headers: { Accept: 'application/json' } });
          return data;
        } catch (error) {
          console.log('unexpected error: ', error);
          throw error;
        }
      };

      const fetchProfileData = async () => {
        const profileData = await GetProfile();
      //   console.log(profileData);

        setName(profileData.first_name)
        setSurname(profileData.last_name)
        setEmail(profileData.email)
        setPhoneNumber(profileData.phone_number)
      };
    
      fetchProfileData();
    }, []);

    useEffect(() => {
      if (newPassword !== passwordConfirm) setErrorMessage('Please confirm Your new password!')
      else setErrorMessage('')
    }, [newPassword, passwordConfirm])
      
    const handleSubmit = async (e: React.SyntheticEvent) => {
      e.preventDefault();
      const url = api_url('auth/user/profile')
      try {
        const updatedProfileData = {
          first_name: name,
          last_name: surname,
          email,
          phone_number: phoneNumber,
        };
    
        const response = await axios.put(url, updatedProfileData, { headers: { Accept: 'application/json' } });
    
        if (response.status === 200) {
          setErrorMessage('')
          setSuccessMessage('User profile updated successfully.');
        } else {
          setSuccessMessage('')
          setErrorMessage('Failed to update user profile.');
        }
      } catch (error) {
        console.error('Error while updating user profile:', error);
        setSuccessMessage('')
        setErrorMessage('An error occurred while updating user profile.');
      }
    };

    const handleChangePass = async (e: React.SyntheticEvent) => {
      e.preventDefault();
      const url = api_url('auth/user/password')
      try {
        const response = await axios.put(url, {
          old_password: oldPassword, 
          new_password: newPassword},
          { headers: { Accept: 'application/json' } })
        if (response.status === 200) {
          setErrorMessage('')
          setSuccessMessage(response.data.message ?? 'Success');
        } else {
          setSuccessMessage('')
          setErrorMessage(response.data.error ?? 'Error');
        }
      } catch (error) {
        console.error('Error while updating user profile:', error);
        setSuccessMessage('')
        setErrorMessage('An error occurred while updating user profile.');
      }
    }

    const handleUserDelete = async () => {
      const url = api_url('auth/user/profile')
      try {
        await axios.delete(url, { headers: { Accept: 'application/json' } });
      } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
      }
      window.location.reload()
    }

    return (
      <Layout>
        <div className="containerCustom borderLightY">
          <div className="p-4 bg-[#1f1b24b2] shadow-md text-white rounded-md">
            <h1 className="text-3xl font-bold mb-4">User Profile</h1>
            {successMessage && <div className="text-green-500">{successMessage}</div>}
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="space-y-4 my-4 flex flex-col items-center justify-center">
              
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-1/4 px-4 py-2 border bgdark rounded-md focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-1/4 px-4 py-2 border bgdark rounded-md focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-1/4 px-4 py-2 border bgdark rounded-md focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-1/4 px-4 py-2 border bgdark rounded-md focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-1/5 px-4 py-2 bg-[#BB86FC] hover:bg-[#996dce] text-[white] rounded-md"
              >
                Save Profile
              </button>
            </form>
            <form onSubmit={handleChangePass} className="space-y-4 my-4 flex flex-col items-center justify-center">
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-1/4 px-4 py-2 border bgdark rounded-md focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-1/4 px-4 py-2 border bgdark rounded-md focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-1/4 px-4 py-2 border bgdark rounded-md focus:outline-none focus:border-blue-500"
              />
              <button type="submit"
                disabled={newPassword !== passwordConfirm}
                className="w-1/5 px-4 py-2 bg-[#BB86FC] hover:bg-[#996dce] text-[white] rounded-md">
                Update Password
                </button>
            </form>
            <button className="w-1/5 px-4 py-2 bg-[#ff0000] hover:bg-[#996dce] text-[white] rounded-md"
            onClick={() => {
              if (window.confirm('Are You sure, You want to delete Your profile? This action is irreversible!')) {
                handleUserDelete()
              }
            }}
            >
              Delete Profile
            </button>
          </div>
        </div>
      </Layout>
    );
    
  };

  export default UserProfile;