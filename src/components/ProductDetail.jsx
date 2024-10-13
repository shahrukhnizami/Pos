import React, { useContext } from 'react';
import Header from './Header';
import Footer from './Footer';
import Newsletter from './Newsletter';
import { useParams } from 'react-router';
import { ProductContext } from '../context/Products';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const ProductDetail = () => {
  const { products, addToCart } = useContext(ProductContext);
  const { id } = useParams();

  // Find the product that matches the id from params
  const product = products.find((item) => item.id === id);

  if (!product) {
    return <div>Product not found!</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <>
      <div className="super_container">
        {/* Header */}
        <Header />

        <div className="container single_product_container">
          <div className="row">
            <div className="col">
              {/* Breadcrumbs */}
              <div className="breadcrumbs d-flex flex-row align-items-center">
                <ul>
                  <li>
                    <Link to="/web">Home</Link>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-angle-right" aria-hidden="true" />
                      {product.category}
                    </a>
                  </li>
                  <li className="active">
                    <a href="#">
                      <i className="fa fa-angle-right" aria-hidden="true" />
                      {product.name}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Product Images */}
            <div className="col-lg-7">
              <div className="single_product_pics">
                <div className="row">
                  <div className="col-lg-3 thumbnails_col order-lg-1 order-2">
                    <div className="single_product_thumbnails">
                      <ul>

                        <li key={id}>
                          <img src={product.image} alt={product.title} />
                        </li>

                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-9 image_col order-lg-2 order-1">
                    <div className="single_product_image">
                      {/* <div
                        className="single_product_image_background"
                        style={{ backgroundImage: `url(${product.image})` }}
                      /> */}
                      <img className="w-11/12 mx-auto" src={`${product.image}`} />

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="col-lg-5">
              <div className="product_details">
                <div className="product_details_title ">
                  <h2 className='text-5xl'>{product.title}</h2>
                  <p>{product.description}</p>
                </div>

                <div className="free_delivery d-flex flex-row align-items-center justify-content-center">
                  <span className="ti-truck" />
                  <span>Free delivery</span>
                </div>

                <div className="original_price">${product.price}</div>
                <div className="product_price">${product.price}</div>

                {/* Star Rating */}
                <ul className="star_rating">
                  {[...Array(5)].map((_, i) => (
                    <li key={i}>
                      <i className={i < product.rating ? 'fa fa-star' : 'fa fa-star-o'} />
                    </li>
                  ))}
                </ul>

                {/* Color Options */}
                <div className="product_color">
                  <span>Select Color:</span>
                  <ul>

                    <li key={id} style={{ background: `${product.color}` }} />

                  </ul>
                </div>

                {/* Quantity Selector */}
                <div className="quantity d-flex flex-column flex-sm-row align-items-sm-center">
                  <span>Quantity:</span>
                  <div className="quantity_selector">
                    <span className="minus">
                      <i className="fa fa-minus" aria-hidden="true" />
                    </span>
                    <span id="quantity_value">1</span>
                    <span className="plus">
                      <i className="fa fa-plus" aria-hidden="true" />
                    </span>
                  </div>


                </div>
                <div className='py-4'>
                  <Button type="primary" size='large' shape='round' danger onClick={handleAddToCart}>
                    Add To Cart
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Additional Components */}
        <div className="tabs_section_container">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="tabs_container">
                  <ul className="tabs d-flex flex-sm-row flex-column align-items-left align-items-md-center justify-content-center">
                    <li className="tab active" >
                      <span>Description</span>
                    </li>
                    <li className="tab" data-active-tab="tab_2">
                      <span>Additional Information</span>
                    </li>
                    <li className="tab" data-active-tab="tab_3">
                      <span>Reviews (2)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                {/* Tab Description */}
                <div id="tab_1" className="tab_container active">
                  <div className="row">
                    <div className="col-lg-5 desc_col">
                      <div className="tab_title">
                        <h4 className='text-2xl'>Description</h4>
                      </div>
                      <div className="tab_text_block">
                        <h2 className='text-5xl'>{product.title}</h2>
                        <p className='text-lg'>
                          {product.description}
                        </p>
                      </div>
                      <div className="tab_image">
                        <img src={product.image} alt="" />
                      </div>
                      <div className="tab_text_block">
                        <h2 className='text-5xl'>{product.title}</h2>
                        <p className='text-lg'>
                          {product.description}
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-5 offset-lg-2 desc_col">
                      <div className="tab_image">
                        <img src={product.image} alt="" />
                      </div>
                      <div className="tab_text_block">
                        <h2 className='text-5xl'>{product.title}</h2>
                        <p className='text-lg'>
                          {product.description}
                        </p>
                      </div>
                      <div className="tab_image desc_last">
                        <img src={product.image} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Tab Additional Info */}
                <div id="tab_2" className="tab_container">
                  <div className="row">
                    <div className="col additional_info_col">
                      <div className="tab_title additional_info_title">
                        <h4>Additional Information</h4>
                      </div>
                      <p>
                        COLOR:<span>Gold, Red</span>
                      </p>
                      <p>
                        SIZE:<span>L,M,XL</span>
                      </p>
                    </div>
                  </div>
                </div>
                {/* Tab Reviews */}
                <div id="tab_3" className="tab_container">
                  <div className="row">
                    {/* User Reviews */}
                    <div className="col-lg-6 reviews_col">
                      <div className="tab_title reviews_title">
                        <h4>Reviews (2)</h4>
                      </div>
                      {/* User Review */}
                      <div className="user_review_container d-flex flex-column flex-sm-row">
                        <div className="user">
                          <div className="user_pic" />
                          <div className="user_rating">
                            <ul className="star_rating">
                              <li>
                                <i className="fa fa-star" aria-hidden="true" />
                              </li>
                              <li>
                                <i className="fa fa-star" aria-hidden="true" />
                              </li>
                              <li>
                                <i className="fa fa-star" aria-hidden="true" />
                              </li>
                              <li>
                                <i className="fa fa-star" aria-hidden="true" />
                              </li>
                              <li>
                                <i className="fa fa-star-o" aria-hidden="true" />
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="review">
                          <div className="review_date">27 Aug 2016</div>
                          <div className="user_name">Brandon William</div>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua.
                          </p>
                        </div>
                      </div>
                      {/* User Review */}
                      <div className="user_review_container d-flex flex-column flex-sm-row">
                        <div className="user">
                          <div className="user_pic" />
                          <div className="user_rating">
                            <ul className="star_rating">
                              <li>
                                <i className="fa fa-star" aria-hidden="true" />
                              </li>
                              <li>
                                <i className="fa fa-star" aria-hidden="true" />
                              </li>
                              <li>
                                <i className="fa fa-star" aria-hidden="true" />
                              </li>
                              <li>
                                <i className="fa fa-star" aria-hidden="true" />
                              </li>
                              <li>
                                <i className="fa fa-star-o" aria-hidden="true" />
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="review">
                          <div className="review_date">27 Aug 2016</div>
                          <div className="user_name">Brandon William</div>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Add Review */}
                    <div className="col-lg-6 add_review_col">
                      <div className="add_review">
                        <form id="review_form" action="post">
                          <div>
                            <h1>Add Review</h1>
                            <input
                              id="review_name"
                              className="form_input input_name"
                              type="text"
                              name="name"
                              placeholder="Name*"
                              required="required"
                              data-error="Name is required."
                            />
                            <input
                              id="review_email"
                              className="form_input input_email"
                              type="email"
                              name="email"
                              placeholder="Email*"
                              required="required"
                              data-error="Valid email is required."
                            />
                          </div>
                          <div>
                            <h1>Your Rating:</h1>
                            <ul className="user_star_rating">
                              <li>
                                <i className="fa fa-star" aria-hidden="true" />
                              </li>
                              <li>
                                <i className="fa fa-star" aria-hidden="true" />
                              </li>
                              <li>
                                <i className="fa fa-star" aria-hidden="true" />
                              </li>
                              <li>
                                <i className="fa fa-star" aria-hidden="true" />
                              </li>
                              <li>
                                <i className="fa fa-star-o" aria-hidden="true" />
                              </li>
                            </ul>
                            <textarea
                              id="review_message"
                              className="input_review"
                              name="message"
                              placeholder="Your Review"
                              rows={4}
                              required=""
                              data-error="Please, leave us a review."
                              defaultValue={""}
                            />
                          </div>
                          <div className="text-left text-sm-right">
                            <button
                              id="review_submit"
                              type="submit"
                              className="red_button review_submit_btn trans_300"
                              value="Submit"
                            >
                              submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Newsletter />
        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
