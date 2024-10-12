import React from 'react';
import { Button, Drawer, Form, Input, message, Select } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../assets/Utills/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const AddUserDrawer = ({ open, onClose }) => {
    const onFinish = async (values) => {
        console.log('Success:', values);
        try {
            // Create user without logging them in
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );

            // Store user data in Firestore
            const docRef = doc(db, "users", userCredential.user.uid);
            await setDoc(docRef, { ...values, uid: userCredential.user.uid });

            // Close the drawer and show success message
            onClose();
            message.success("User account created successfully");
        } catch (err) {
            // Handle any errors that occur
            message.error(err.message);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <Drawer title="User Form" onClose={onClose} open={open}>
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
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="role" label="Role">
                    <Select>
                        <Select.Option value="user">User</Select.Option>
                        <Select.Option value="admin">Admin</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};
