import React, { useContext } from 'react';
import { LaptopOutlined, NotificationOutlined, ProductOutlined, RightSquareFilled, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Menu, theme, message } from 'antd';
import { Outlet, useNavigate } from 'react-router';
import { auth } from '../../assets/Utills/firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../../context/Auth'; // Ensure this context is correctly set up
import { Link } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

// Menu items configuration
const items2 = [
  {
    label: "Users",
    icon: UserOutlined,
    route: "/admin/users",
  },
  {
    label: "Products",
    icon: LaptopOutlined,
    route: "/admin/products",
  },
  {
    label: "Purchases",
    
    icon: ProductOutlined,
    route: "/admin/purchases",
  },
  {
    label: "Category",
    icon: NotificationOutlined,
    route: "/admin/category",
  },
  {
    label: "Ordes",
    icon: NotificationOutlined,
    route: "/admin/orders",
  },
  {
    label: "Go tO web",
    
    icon: RightSquareFilled,
    route: "../web",
  },
].map((data) => ({
  key: data.route,
  icon: React.createElement(data.icon),
  label: data.label,
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  
  // Use AuthContext to get the user information
  const { user } = useContext(AuthContext); // Ensure your AuthContext provides the user object
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      message.success("User logged out successfully");
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      message.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <Layout>
      <Header className='bg-red-600 flex justify-between items-center'>
        <div className="demo-logo text-white font-bold text-4xl">
          Welcome {user ? user.displayName || user.email : "Admin"}
        </div>
      
        <Button onClick={handleLogout} danger>
          Logout
        </Button>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["/admin/users"]}
            onClick={(e) => navigate(e.key)}
            style={{ height: '100%', borderRight: 0 }}
            items={items2}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {/* You can add Breadcrumb items here if needed */}
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
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

export default Dashboard;
