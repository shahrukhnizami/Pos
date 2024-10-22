import React, { useContext, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, LaptopOutlined, NotificationOutlined, ProductOutlined, RightSquareFilled, StockOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Menu, theme, message } from 'antd';
import { Outlet, useNavigate } from 'react-router';
import { auth } from '../../assets/Utills/firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../../context/Auth';

const { Header, Content, Sider } = Layout;

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
    label: "Orders",
    icon: NotificationOutlined,
    route: "/admin/orders",
  },
  {
    label: "Stocks",
    icon: StockOutlined,
    route: "/admin/stocks",
  },
  {
    label: "Go to web",
    icon: RightSquareFilled,
    route: "../web",
  },
].map((data) => ({
  key: data.route,
  icon: React.createElement(data.icon),
  label: data.label,
}));

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  
  // Use AuthContext to get the user information
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
    <Layout>
      <Header className='bg-red-600 flex justify-between items-center px-4'>
        <div className="demo-logo text-white font-bold text-2xl md:text-4xl">
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
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              size="large"
              style={{ marginBottom: '20px', width: '100%' }} // Full-width button for small screens
            />
          </div>
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
            {/* Add Breadcrumb items if needed */}
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
