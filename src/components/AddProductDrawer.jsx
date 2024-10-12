import React, { useContext, useState } from 'react';
import { Button, Drawer, Form, Input, message, Select, Upload, Switch } from 'antd';
import { db, storage } from '../assets/Utills/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'; 
import { PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { CategoryContext } from '../context/Category';
import TextArea from 'antd/es/input/TextArea';

export const AddProductDrawer = ({ open, onClose }) => {
  const { categories } = useContext(CategoryContext);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null); // Image file
  const [isEnabled, setIsEnabled] = useState(true); // Track product enable/disable status

  // Filter active categories for the Select dropdown
  const activeCategories = categories.filter(category => category.isActive);

  const onFinish = async (values) => {
    if (!imageFile) {
      message.error('Please upload an image');
      return;
    }

    try {
      setLoading(true);
      
      const storageRef = ref(storage, `products/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          message.error(error.message);
          setLoading(false);
        },
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          // Add product to Firestore with isEnabled field
          await addDoc(collection(db, 'products'), { 
            ...values, 
            image: imageUrl, 
            isEnabled,  // Add isEnabled value to Firestore
          });
          form.resetFields();
          setImageFile(null); // Reset image after successful upload
          setLoading(false);
          onClose();
          message.success('Product added successfully');
        }
      );
    } catch (err) {
      message.error(err.message);
      setLoading(false);
    }
  };

  const handleImageChange = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return;
    }
    
    // Set the selected image file
    setImageFile(file);
  };

  return (
    <Drawer title="Add Product Form" onClose={onClose} open={open}>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 800 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Product Title"
          name="title"
          rules={[{ required: true, message: 'Please input your Title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Product Price"
          name="price"
          rules={[{ required: true, message: 'Please input your Price!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Product Quantity"
          name="quantity"
          rules={[{ required: true, message: 'Please input your Quantity!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item 
          name="category" 
          label="Category" 
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select>
            {activeCategories.map((category) => (
              <Select.Option key={category.id} value={category.categoryname}>
                {category.categoryname}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Upload Image" valuePropName="fileList" rules={[{ required: true, message: 'Please upload an image' }]}>
          <Upload
            listType="picture-card"
            showUploadList={false} // Disable default list
            beforeUpload={(file) => {
              handleImageChange(file); // Handle image change
              return false; // Prevent default upload
            }}
          >
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="uploaded" style={{ width: '100%' }} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* Add Switch for Enable/Disable Product */}
        <Form.Item label="Enable Product" name="isEnabled">
          <Switch
            checked={isEnabled}
            onChange={(checked) => setIsEnabled(checked)} // Toggle enable/disable
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button loading={loading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
