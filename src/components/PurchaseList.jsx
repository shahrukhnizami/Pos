import { Modal, Space, Table, Input, Form } from "antd";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { db } from "../assets/Utills/firebase";
import { toast, ToastContainer } from "react-toastify";

function PurchaseList({ searchQuery }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getProductsFromDB();
  }, []);

  const getProductsFromDB = async () => {
    try {
      setLoading(true);
      const ref = collection(db, "purchases");
      const productData = await getDocs(ref);
      if (!productData.empty) {
        const allProducts = [];
        productData.forEach((product) => {
          allProducts.push({ ...product.data(), id: product.id });
        });
        setPurchases(allProducts);
      }
      setLoading(false);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this purchase?',
      okType: 'danger',
      onOk: async () => {
        await deleteDoc(doc(db, `purchases/${record.id}`));
        toast.success('Purchase deleted successfully');
        getProductsFromDB();
      },
    });
  };

  const handleEdit = (record) => {
    setEditingPurchase(record);
    setIsEditModalOpen(true);
    form.setFieldsValue(record);  // Populate the form with existing data
  };

  const handleEditSubmit = async () => {
    try {
      const values = form.getFieldsValue();
      const purchaseDoc = doc(db, `purchases/${editingPurchase.id}`);
      await updateDoc(purchaseDoc, values);
      toast.success("Purchase updated successfully");
      setIsEditModalOpen(false);
      setEditingPurchase(null);
      getProductsFromDB();
    } catch (error) {
      toast.error("Failed to update purchase");
    }
  };

  const filteredpurchases = purchases.filter(purchase =>
    purchase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    purchase.quantity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    purchase.id.toLowerCase().includes(searchQuery.toLowerCase())||
    purchase.price.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: "Purchase Id",
      dataIndex: "id",
      key: "id",
    },
   
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
    },
    {
      title: "Item",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => handleEdit(record)} className="hover:text-green-500" />
          <DeleteOutlined onClick={() => handleDelete(record)} className="hover:text-red-500" />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={filteredpurchases} columns={columns} loading={loading} />
      
      <Modal
        title="Edit Purchase"
        visible={isEditModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="purchaseDate" label="Purchase Date">
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Item">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <Input />
          </Form.Item>
          <Form.Item name="unit" label="Unit">
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default PurchaseList;
