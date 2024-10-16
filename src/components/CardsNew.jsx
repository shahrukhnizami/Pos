import { Button } from 'antd';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';



const CardsNew = ({products},{item}) => {
  const {  addItemTOCart,isItemAdded,quantity } = useContext(CartContext);
  
  
  // const { products } = useContext(ProductContext); // Get products from context

  // console.log("allProducts", products); // Log the products data to the console

  return (
    <>
      {products && products.length > 0 ? (
        products
          // Use === to check if isEnabled is true (either boolean or string based on your data type)
          .filter((product) => product.isEnabled === true) // If isEnabled is a boolean
          // .filter((product) => product.isEnabled === "true") // Uncomment this if isEnabled is a string
          .map((product) => (
            
            <div key={product.id} className="product-item">
               <Link to={`/${product.id}`}> 
              <div className="product product_filter">
                <div className="product_image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="favorite" />
                <div className="product_bubble product_bubble_left product_bubble_green d-flex flex-column align-items-center">
                  <span>new</span>
                </div>
                <div className="product_info">
                  <h6 className="product_name">
                    <a href="#">{product.title}</a>
                  </h6>
                  <div className="product_price">${product.price}</div>
                </div>
              </div>
              </Link>
              <div className="flex justify-center">
              <Button type="primary" danger onClick={() => addItemTOCart(product)}>
                {isItemAdded(product.id)
                  ? `Added (${isItemAdded(product.id).quantity})`
                  : `Add to Cart`}
              </Button>
              </div>
              
            </div>
            
          ))
      ) : (
        <p>No enabled products available</p> // Fallback in case no enabled products are found
      )}
    </>
  );
};

export default CardsNew;
