import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, Table, Spin, Button, message, Switch, Select } from 'antd';
import { db } from '../assets/Utills/firebase'; // Ensure you import Firebase
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // Step 1: Add search state

  useEffect(() => {
    getCategoriesFromDB();
  }, []);

  const getCategoriesFromDB = async () => {
    setLoading(true);
    const ref = collection(db, "category");
    const categoryData = await getDocs(ref);
    if (!categoryData.empty) {
      const allCategories = [];
      categoryData.forEach((categoryInfo) => {
        allCategories.push({ ...categoryInfo.data(), id: categoryInfo.id });
      });
      setCategories([...allCategories]);
    }
    setLoading(false);
  };

  const edit = (record) => {
    setIsEditing(true);
    setEditCategory({ ...record });
  };

  const resetCategory = async () => {
    try {   
      // Update Firestore category document
      if (editCategory) {
        const categoryRef = doc(db, 'category', editCategory.id);
        await updateDoc(categoryRef, {
          categoryname: editCategory.categoryname, // Correct key for the category name
          isActive: editCategory.isActive, // Ensure isActive is updated as well
        });
        setIsEditing(false);
        toast.success('Category updated successfully');
        getCategoriesFromDB();
      }
    } catch (error) {
      message.error('Failed to update category');
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure to delete this category?',
      okType: 'danger',
      onOk: async () => {
        await deleteDoc(doc(db, `category/${record.id}`));
        toast.success('Category deleted successfully');
        getCategoriesFromDB();
      },
    });
  };

  const toggleActiveStatus = async (record) => {
    const categoryRef = doc(db, 'category', record.id);
    await updateDoc(categoryRef, {
      isActive: !record.isActive, // Toggle the active status
    });
    toast.success(`Category status updated to ${!record.isActive ? 'Active' : 'Inactive'}`);
    getCategoriesFromDB();
  };

  const columns = [
    {
      title: 'Category',
      dataIndex: 'categoryname',
      key: 'categoryname',
      sorter: (a, b) => a.categoryname.localeCompare(b.categoryname), // Sort alphabetically by category name
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      sorter: (a, b) => a.isActive - b.isActive, // Sort by active status (true/false as 1/0)
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => toggleActiveStatus(record)} // Toggle active status on change
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* Uncomment the Edit button if needed */}
          {/* <EditOutlined onClick={() => edit(record)} className="hover:text-green-500" /> */}
          <DeleteOutlined onClick={() => handleDelete(record)} className="hover:text-red-500" />
        </Space>
      ),
    },
  ];

  // Step 3: Filter categories based on the search query
  const filteredCategories = categories.filter((category) =>
    category.categoryname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Input 
        placeholder="Search Categories" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        style={{ marginBottom: 16 }} 
      /> {/* Step 2: Search input */}

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={filteredCategories} rowKey="id" /> // Use filtered categories
      )}
      <Modal
        title="Edit Category"
        open={isEditing}
        okText="Save"
        onCancel={() => setIsEditing(false)}
        onOk={resetCategory}
      >
        <div className="flex flex-col gap-3">
          <label>Category Title</label>
          <Select
            value={editCategory?.categoryname} // Use category name for the Select value
            onChange={(value) => setEditCategory((prev) => ({ ...prev, categoryname: value }))} // Set selected category name
            style={{ width: '100%' }}
          >
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.categoryname}>
                {category.categoryname}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default CategoryList;
