import React from 'react'

const Cards = () => {
  return (
    <>
       <div className="product-item men">
              <div className="product discount product_filter">
                <div className="product_image">
                  <img src="images/product_1.png" alt="" />
                </div>
                <div className="favorite favorite_left" />
                <div className="product_bubble product_bubble_right product_bubble_red d-flex flex-column align-items-center">
                  <span>-$20</span>
                </div>
                <div className="product_info">
                  <h6 className="product_name">
                    <a href="single.html">
                      Fujifilm X100T 16 MP Digital Camera (Silver)
                    </a>
                  </h6>
                  <div className="product_price">
                    $520.00<span>$590.00</span>
                  </div>
                </div>
              </div>
              <div className="red_button add_to_cart_button">
                <a href="#">add to cart</a>
              </div>
            </div>
    </>
  )
}

export default Cards
