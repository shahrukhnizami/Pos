import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Switch, message } from 'antd';
import { db } from '../assets/Utills/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useForm } from 'antd/es/form/Form';

const AddCategoryDrawer = ({ open, onClose }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isActive, setIsActive] = useState(false); // State for switch

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryQuery = await getDocs(collection(db, "category"));
      const categoryList = categoryQuery.docs.map(doc => doc.data());
      setCategories(categoryList);
    };
    fetchCategories();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Check if category with the same name exists
      const existingCategory = categories.find((data) => data.categoryname === values.categoryname);

      if (existingCategory) {
        message.error('Category with this name already exists!');
        setLoading(false);
        return;
      }

      // Add the data to Firestore with an auto-generated ID
      await addDoc(collection(db, "category"), {
        categoryname: values.categoryname,
        isActive,  // Save the switch state
      });

      setLoading(false);
      onClose();
      message.success('Category added successfully');
      form.resetFields(); // Reset form fields after successful submission
    } catch (err) {
      message.error(err.message);
      setLoading(false);
    }
  };

  const handleFormChange = (changedValues) => {
    const { categoryname } = changedValues;
    // Enable the button only if categoryname is provided and is not empty
    setIsButtonDisabled(!categoryname || categoryname.trim() === '');
  };

  const handleSwitchChange = (checked) => {
    setIsActive(checked); // Update the switch state
  };

  return (
    <Drawer title="Add Category Form" onClose={onClose} open={open}>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        onValuesChange={handleFormChange} // Track input changes
        autoComplete="off"
      >
        <Form.Item
          label="Category Title"
          name="categoryname"
          rules={[{ required: true, message: 'Please input the category name!' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item label="Active">
          <Switch 
            checked={isActive} // Control switch based on state
            onChange={handleSwitchChange} // Handle switch change
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button loading={loading} type="primary" htmlType="submit" disabled={isButtonDisabled}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddCategoryDrawer;
