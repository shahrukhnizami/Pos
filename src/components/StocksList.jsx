import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, Table, Switch, Select, Spin, Progress } from 'antd';
import { db } from '../assets/Utills/firebase';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const StockList = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productStatus, setProductStatus] = useState('all');
  const { Option } = Select;

  useEffect(() => {
    getProductsFromDB();
  }, []);

  const getProductsFromDB = async () => {
    setLoading(true);
    try {
      const ref = collection(db, 'products');
      const productData = await getDocs(ref);
      if (!productData.empty) {
        const allProducts = productData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setProducts(allProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const edit = (record) => {
    setIsEditing(true);
    setEditProduct({ ...record });
  };

  const resetProduct = async () => {
    if (!editProduct) return;
    try {
      setLoading(true);
      const productDoc = doc(db, 'products', editProduct.id);
      await updateDoc(productDoc, {
        title: editProduct.title,
        price: editProduct.price,
        quantity: editProduct.quantity,
        category: editProduct.category,
      });

      toast.success('Product updated successfully');
      setIsEditing(false);
      getProductsFromDB();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure to delete this product?',
      okType: 'danger',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteDoc(doc(db, 'products', record.id));
          toast.success('Product deleted');
          getProductsFromDB();
        } catch (error) {
          toast.error('Error deleting product');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const maxStock = 100;

  const filteredProducts = products.filter(product => {
    const statusFilter =
      productStatus === 'all' ||
      (productStatus === 'active' && product.isEnabled) ||
      (productStatus === 'inactive' && !product.isEnabled);

    const searchFilter =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return statusFilter && searchFilter;
  });

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => (
        <Progress
          percent={(quantity / maxStock) * 100}
          status={quantity > 0 ? 'active' : 'exception'}
          strokeColor={quantity > 20 ? '#52c41a' : '#ff4d4f'}
        />
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
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
      key: 'enable',
      render: (record) => (
        <Switch
          checked={record.isEnabled}
          onChange={async (checked) => {
            try {
              const productDoc = doc(db, 'products', record.id);
              await updateDoc(productDoc, { isEnabled: checked });
              toast.success(`Product ${checked ? 'enabled' : 'disabled'} successfully`);
              getProductsFromDB();
            } catch (error) {
              console.error('Error updating product status:', error);
              toast.error('Failed to update product status');
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
          {/* Dropdown to select active, inactive, or all products */}
          <Select
            value={productStatus}
            onChange={(value) => setProductStatus(value)}
            style={{ marginBottom: 16, width: '100%', maxWidth: 200 }} // Responsive width
          >
            <Option value="all">All Products</Option>
            <Option value="active">Enable Products</Option>
            <Option value="inactive">Disable Products</Option>
          </Select>

          {/* Products Table with scrollable feature */}
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey="id"
            scroll={{ x: 'max-content' }} // Enable horizontal scrolling
          />

          {/* Edit Product Modal */}
          <Modal
            title="Editing Product"
            open={isEditing}
            okText="Save"
            onCancel={() => setIsEditing(false)}
            onOk={resetProduct}
            centered
          >
            <div className="flex flex-col gap-3">
              <label>Product Title</label>
              <Input
                value={editProduct?.title}
                onChange={(e) => setEditProduct((prev) => ({ ...prev, title: e.target.value }))}
                style={{ width: '100%' }} // Full-width input
              />
              <label>Price</label>
              <Input
                value={editProduct?.price}
                type="number"
                onChange={(e) => setEditProduct((prev) => ({ ...prev, price: e.target.value }))}
                style={{ width: '100%' }} // Full-width input
              />
              <label>Quantity</label>
              <Input
                value={editProduct?.quantity}
                onChange={(e) => setEditProduct((prev) => ({ ...prev, quantity: e.target.value }))}
                type="number"
                style={{ width: '100%' }} // Full-width input
              />
              <label>Category</label>
              <Input
                disabled
                value={editProduct?.category}
                onChange={(e) => setEditProduct((prev) => ({ ...prev, category: e.target.value }))}
                style={{ width: '100%' }} // Full-width input
              />
            </div>
          </Modal>
        </>
      )}
      <ToastContainer />
    </>
  );
};
