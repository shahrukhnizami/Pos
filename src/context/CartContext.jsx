
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

function CartContextProvider({ children }) {

  const [cartitem, setCartitem] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  console.log("CartItems", cartitem);


  useEffect(() => {

    if (isLoaded) {
      localStorage.setItem("cartitem", JSON.stringify(cartitem))
    }

  }, [cartitem])


  useEffect(() => {
    const itemsFromStorage = localStorage.getItem("cartitem");

    if (itemsFromStorage) {
      setCartitem([...JSON.parse(itemsFromStorage)]);
      setIsLoaded(true);
    }
  }, [])





  function addItemTOCart(item) {
    const arr = cartitem;
    const itemIndex = cartitem.findIndex((data) => data.id == item.id);
    if (itemIndex == -1) {
      // item array mein nahn he
      arr.push({ ...item, quantity: 1 });
    } else {
      arr[itemIndex].quantity++;

    }
    setCartitem([...arr]);
  }
  function lessQuantitfromcart(id) {
    const arr = [...cartitem];  // Clone the current cart items to avoid direct mutation
    const itemIndex = arr.findIndex((data) => data.id === id);  // Find the item by its id

    if (itemIndex !== -1 && arr[itemIndex].quantity > 0) {
        arr[itemIndex].quantity--;  // Decrease the quantity
    }

    setCartitem(arr);  // Update the state
}




  function removeItemFromCart(id) {
    const arr = cartitem
    const itemindex = cartitem.findIndex((data) => data.id == id)
    arr.splice(itemindex, 1);
    setCartitem([...arr])

  }

  function isItemAdded(id) {
    const arr = cartitem
    const itemindex = cartitem.findIndex((data) => data.id == id)
    if (itemindex == -1) {

      return null
    }
    else {
      return arr[itemindex]

    }

  }
  const clearCart = () => {
   setCartitem([]) // Clears all items from the cart
  };

  return (
    <CartContext.Provider value={{ cartitem, setCartitem, addItemTOCart, isItemAdded, removeItemFromCart, lessQuantitfromcart,clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContextProvider;