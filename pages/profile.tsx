import { useEffect, useState } from 'react';
import { PrismaClient } from '@prisma/client';
import '@/components/css/home.css';
import '@/components/css/forms.css';
import  '@/app/globals.css';
import Layout from '@/app/layoutPattern';
import '@/components/css/tailwind.css';
import  Link  from 'next/link';
import { useSearchParams } from 'next/navigation';
import api_url from '@/lib/api_url';
import axios from 'axios';



const UserProfile = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const params = useSearchParams()
    
    const url = api_url('auth/user/profile')


    useEffect(() => {
        console.log(url);
      
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
          setPassword(profileData.password)
        };
      
        fetchProfileData();
      }, []);
      
      const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
      
        try {
          const updatedProfileData = {
            first_name: name,
            last_name: surname,
            email,
            password,
            phone_number: phoneNumber,
          };
      
          const response = await axios.put(url, updatedProfileData, { headers: { Accept: 'application/json' } });
      
          if (response.status === 200) {
            setSuccessMessage('User profile updated successfully.');
          } else {
            setErrorMessage('Failed to update user profile.');
          }
        } catch (error) {
          console.error('Error while updating user profile:', error);
          setErrorMessage('An error occurred while updating user profile.');
        }
      };

      

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
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <button
                type="submit"
                className="w-1/5 px-4 py-2 bg-[#ff0000] hover:bg-[#996dce] text-[white] rounded-md"
              >
                Delete Profile
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
    
  };

  export default UserProfile;