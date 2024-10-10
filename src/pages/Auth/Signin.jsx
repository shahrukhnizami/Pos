import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../assets/Utills/firebase';

const Signin = () => {
  const [loading, setLoading] = useState(false); // Initialize loading state

  const onFinish = async (values) => {
    console.log('Success:', values);
    setLoading(true); // Set loading to true when the form is submitted
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success("Login successful!"); // Notify on success
      console.log("User is logged in");
    } catch (error) {
      console.error(error);
      message.error(error.message); // Notify on error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <h1 className='text-center text-5xl py-4'>Welcome To Admin Panel</h1>
      <p className='text-center text-2xl font-semibold py-4'>Please Login!</p>
      <div className='flex justify-center'>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email" // Corrected label
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]} // Updated message
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              danger
              type="primary"
              htmlType="submit"
              loading={loading} // Show loading state
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Signin;
