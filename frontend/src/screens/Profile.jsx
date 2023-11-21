import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { useUpdateUserMutation } from '../slices/usersApiSlice';
import axios from 'axios';
import { baseUrl, imageUrl } from '../../config/baseURL';
import { uploadImage } from '../slices/authSlice';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [image,setImage] = useState('')
  
  
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  const { userInfo } = useSelector((state) => state.auth);
  const [imgId, setImgId] = useState(userInfo)
  

  
  const [updateProfile, {isLoading}] = useUpdateUserMutation()
  
  
  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setImage(userInfo.image)
    console.log(userInfo);
    console.log(userInfo.image);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
        try {
            const res = await updateProfile({
                _id: userInfo._id,
                name,
                email,
                password,
            }).unwrap();
            dispatch(setCredentials({...res}))
            toast.success('profile updated')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }
  };

  const imageUpload = async (e) => {
    e.preventDefault();
  
    if (profilePicture) {
      const formData = new FormData();
      formData.append("image", profilePicture);
      formData.append("email", userInfo.email);
  
      try {
        const response = await axios.post(`${baseUrl}/users/upload-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization':  userInfo.token,
          },
        }).then((response) => {
          // Handle the response
          const data =response.data
          dispatch(uploadImage(data))
          setImgId(response.data)
          toast.success('File uploaded successfully');
        })
      }
       catch (error) {
        console.error('Error uploading image:', error);
  
        if (error.response) {
          // The request was made and the server responded with a status code
          // other than 2xx (e.g., 500 Internal Server Error)
          console.log('Server response:', error.response.data);
          console.log('Status code:', error.response.status);
          console.log('Headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('No response received. Request:', error.request);
        } else {
          // Something happened in setting up the request
          console.log('Error setting up the request:', error.message);
        }
  
        toast.error('Failed to upload image. See console for more details.');
      }
    } else {
      toast.warning('Please select an image to upload.');
    }
  };
  
  return (
    <>
      <FormContainer>
        <h1>Update Profile</h1>
        {/* <img src={`${imageUrl}/${userInfo.image}`} alt="User Profile" /> */}
        <Form onSubmit={submitHandler}>
        {image ? (
          <img
            alt="Profile pic"
            width="200px"
            className="mx-auto d-block"
            src={`${imageUrl}/${userInfo.image}`}
          />
        ) : (
          ''
        )}          <Form.Group className="my-2" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="my-2" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Update
          </Button>

          {isLoading && <Loader />}
        </Form>
      </FormContainer>

      <FormContainer>
        <form onSubmit={imageUpload}>
          <Form.Group className="my-2" controlId="profilePicture">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />

            <Button  type="submit" variant="primary" className="mt-3">
              Upload
            </Button>
          </Form.Group>
        </form>
      </FormContainer>
    </>
  );
};

export default Profile;