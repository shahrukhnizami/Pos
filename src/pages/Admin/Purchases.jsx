import React, { useState } from "react";
import { Button,  Form, Input } from "antd";
import AddPurchaseDrawer from "../../components/AddPurchaseDrawer";
import PurchaseList from "../../components/PurchaseList";

function Purchases() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(''); // State for search query

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between mb-5">
      <h1 className="text text-5xl font-bold">All Purchases</h1>
        <Button type="primary" onClick={showDrawer}>
          Add Purchases
        </Button>
      </div>

      <Form>
      <Form.Item label="Search" name="search" type="text">
        <Input
          placeholder="Search products"
          onChange={(e) => setQuery(e.target.value)} // Set the search query state
        />
      </Form.Item>
      </Form>

      <AddPurchaseDrawer onClose={onClose} open={open} />

      <PurchaseList searchQuery={query} />
    </div>
  );
}

export default Purchases;