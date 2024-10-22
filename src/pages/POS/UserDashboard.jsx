import React, { useContext, useState } from 'react';
import { LaptopOutlined, MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined, RightSquareFilled } from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Menu, theme, message } from 'antd';
import { Outlet, useNavigate } from 'react-router';
import { auth } from '../../assets/Utills/firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../../context/Auth';

const { Header, Content, Sider } = Layout;

// Menu items configuration
const items2 = [
  {
    label: "Products",
    icon: LaptopOutlined,
    route: "/userdashboard/useraddproducts",
  },
  {
    label: "Add Category",
    icon: NotificationOutlined,
    route: "/userdashboard/useraddcategory",
  },
  {
    label: "Go to Web",
    icon: RightSquareFilled,
    route: "../web",
  },
].map((data) => ({
  key: data.route,
  icon: React.createElement(data.icon),
  label: data.label,
}));

const UserDashboard = () => {
  
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      message.success("User logged out successfully");
      navigate("/");
    } catch (error) {
      message.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className='bg-red-600 flex justify-between items-center p-4'>
        <div className="text-white font-bold text-lg">
          Welcome {user ? user.displayName || user.email : "Admin"}
        </div>
        <Button onClick={handleLogout} danger>
          Logout
        </Button>
      </Header>
      <Layout>
      <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="md" // Responsive breakpoint
          collapsedWidth="0" // Hide sidebar on small screens
          width={200}
          style={{ background: colorBgContainer }}
        >
          {/* Sidebar toggle button */}
          <div style={{ padding: '10px 16px', textAlign: 'left' }}>
            <Button
              type="primary"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <MenuUnfoldOutlined  /> : <MenuFoldOutlined />}
              size="large"
              style={{ marginBottom: '20px', width: '100%', backgroundColor:"#dc2626" }} // Full-width button for small screens
            />
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={["/userdashboard/useraddproducts"]} // Adjust the default selected key as needed
            onClick={(e) => navigate(e.key)}
            style={{ height: '100%', borderRight: 0 }}
            items={items2}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
     
        <Breadcrumb style={{ margin: '16px 0' }}>
            {/* Add Breadcrumb items if needed */}
            <h1 className='text-3xl  font-bold'>Well Come User Dashboard</h1>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 80,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
            
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default UserDashboard;
