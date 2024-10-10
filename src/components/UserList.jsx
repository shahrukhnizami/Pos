import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, Table, Switch, Select, Spin } from 'antd';
import { db } from '../assets/Utills/firebase';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;

const UserList = ({ searchQuery }) => {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState('all'); // State for user status (all/active/inactive)

  const auth = getAuth();

  useEffect(() => {
    getUsersFromDB();
  }, []);

  const getUsersFromDB = async () => {
    setLoading(true);
    try {
      const ref = collection(db, 'users');
      const userData = await getDocs(ref);
      if (!userData.empty) {
        const allUsers = userData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setUsers(allUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const edit = (record) => {
    setIsEditing(true);
    setEditUser({ ...record });
  };

  const resetUser = async () => {
    if (!editUser) return;
    try {
      setLoading(true);
      const userDoc = doc(db, 'users', editUser.id);
      await updateDoc(userDoc, {
        username: editUser.username,
        email: editUser.email,
        role: editUser.role,
        isActive: editUser.isActive,
      });

      const user = auth.currentUser;
      if (user) {
        if (editUser.email !== user.email) {
          await updateEmail(user, editUser.email);
        }
        if (editUser.password) {
          await updatePassword(user, editUser.password);
        }
      }

      toast.success('User updated successfully');
      setIsEditing(false);
      getUsersFromDB();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure to delete this user?',
      okType: 'danger',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteDoc(doc(db, 'users', record.id));
          toast.success('User deleted');
          getUsersFromDB();
        } catch (error) {
          toast.error('Error deleting user');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Filter users based on status (all, active, inactive) and search query
  const filteredUsers = users.filter(user => {
    const statusFilter =
      userStatus === 'all' || (userStatus === 'active' && user.isActive) || (userStatus === 'inactive' && !user.isActive);

    const searchFilter =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());

    return statusFilter && searchFilter;
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => edit(record)} className="hover:text-green-500" />
          <DeleteOutlined onClick={() => handleDelete(record)} className="hover:text-red-500" />
        </Space>
      ),
    },
    {
      title: 'Enable/Disable',
      key: 'toggle',
      render: (record) => (
        <Switch
          checked={record.isActive}
          onChange={async (checked) => {
            try {
              const userDoc = doc(db, 'users', record.id);
              await updateDoc(userDoc, { isActive: checked });
              toast.success(`User ${checked ? 'enabled' : 'disabled'} successfully`);
              getUsersFromDB(); // Refresh the list
            } catch (error) {
              console.error('Error updating user status:', error);
              toast.error('Failed to update user status');
            }
          }}
        />
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Dropdown to select active, inactive, or all users */}
          <Select
            value={userStatus}
            onChange={(value) => setUserStatus(value)}
            style={{ marginBottom: 16, width: 200 }}
          >
            <Option value="all">All Users</Option>
            <Option value="active">Active Users</Option>
            <Option value="inactive">Inactive Users</Option>
          </Select>
          <Table columns={columns} dataSource={filteredUsers} rowKey="id" />
        </>
      )}
      <Modal
        title="Editing User"
        open={isEditing}
        okText="Save"
        onCancel={() => setIsEditing(false)}
        onOk={resetUser}
      >
        <div className="flex flex-col gap-3">
          <label>User Name</label>
          <Input
            value={editUser?.username}
            onChange={(e) => setEditUser((prev) => ({ ...prev, username: e.target.value }))}
          />
          <label>Email</label>
          <Input disabled value={editUser?.email} />
          <label>Role</label>
          <Select
            value={editUser?.role}
            onChange={(value) => setEditUser((prev) => ({ ...prev, role: value }))}
            placeholder="Select a role"
          >
            <Option value="admin">Admin</Option>
            <Option value="user">User</Option>
          </Select>
          <label>Status</label>
          <Select
            value={editUser?.isActive ? 'active' : 'inactive'}
            onChange={(value) => setEditUser((prev) => ({ ...prev, isActive: value === 'active' }))}
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
          <label>Password</label>
          <Input.Password
            value={editUser?.password}
            onChange={(e) => setEditUser((prev) => ({ ...prev, password: e.target.value }))}
          />
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default UserList;
