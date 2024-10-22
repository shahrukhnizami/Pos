import { useState } from "react";
import { Button, Form, Input } from "antd"; // Removed Spin import as it's unused
import { StockList } from "../../components/StocksList";

function Stocks() {
  const [query, setQuery] = useState("");

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-5">
        <h1 className="text-2xl md:text-5xl font-bold">Stock Inventory</h1>
        {/* Optionally, you can add a button here for adding new stocks */}
        {/* <Button type="primary" className="mt-4 md:mt-0">Add Stock</Button> */}
      </div>

      <Form className="mb-4">
        <Form.Item label="Search Stock" name="search" className="mb-0">
          <Input
            placeholder="Search Stock Item"
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form.Item>
      </Form>

      <StockList searchQuery={query} /> {/* List of stock items based on search query */}
    </div>
  );
}

export default Stocks;
