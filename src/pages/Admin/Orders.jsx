import { useState } from "react";
import { Button, Form, Input, Spin } from "antd"; // Import Spin for loading indicator
import { UserList } from "../../components/UserList";
import { AddUserDrawer } from "../../components/AdduserDrawer";
import { OrdersList } from "../../components/OrdesList";

function Orders() {
  // const [loading, setLoading] = useState(false); // Loading state
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(""); // State for search query

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleAddUser = async (userData) => {
    // setLoading(true); // Start loading
    try {
      // Add your user addition logic here
      // e.g., await addUserToDB(userData);
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      // setLoading(false); // Stop loading
      onClose(); // Close the drawer after adding user
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-5">
        <h1 className="text text-5xl font-bold">All Orders</h1>
        <Button danger type="primary" onClick={showDrawer}>
          Add User
        </Button>
      </div>
      <Form>
      <Form.Item label="Search" name="search" type="text">
        <Input
          placeholder="Search Order"
          onChange={(e) => setQuery(e.target.value)} // Capture search query
        />
      </Form.Item>
      </Form>

      <AddUserDrawer onClose={onClose} open={open} onAddUser={handleAddUser} />
      
      
{/* <AddUserDrawer/> */}
   
        {/* <UserList searchQuery={query} /> */}
        {/* <UserList searchQuery={query}/> */}
 {/* <UserList searchQuery={query}/>       */}
 <OrdersList searchQuery={query} />
        
        
           
      
    </div>
  );
}

export default Orders;
