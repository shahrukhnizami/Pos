import React, { useContext, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Benefits from '../../components/Benefits';
import Newsletter from '../../components/Newsletter';
import CardsNew from '../../components/CardsNew';
import { CategoryContext } from '../../context/Category';
import { ProductContext } from '../../context/Products';
import { Link } from 'react-router-dom';

const Web = () => {
    const { categories } = useContext(CategoryContext); // Get categories from context
    const { products } = useContext(ProductContext);    // Get products from context
    const activeCategories = categories.filter(category => category.isActive === true);
    const [searchQuery, setSearchQuery] = useState('');

    // State for the selected category name, default is 'all' to show all products
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Filter products based on the selected category
    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category === selectedCategory);

    return (
        <div>
            <div className="super_container">
                {/* Header */}
                <Header setSearchQuery={setSearchQuery}  />

                {/* Slider */}
                <div
                    className="main_slider"
                    style={{ backgroundImage: "url(images/slider_1.jpg)" }}
                >
                    <div className="container fill_height">
                        <div className="row align-items-center fill_height">
                            <div className="col">
                                <div className="main_slider_content">
                                    <h6>Spring / Summer Collection 2017</h6>
                                    <h1>Get up to 30% Off New Arrivals</h1>
                                    <div className="red_button shop_now_button">
                                        <a href="#">shop now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner */}
                <div className="banner">
                    <div className="container">
                   
                        <div className="row">
                            <div className="col-md-4">
                                <div
                                    className="banner_item align-items-center"
                                    style={{ backgroundImage: "url(images/banner_1.jpg)" }}
                                >
                                    
                                    <div className="banner_category">
                                        {/* <a href="#" onClick={() => setSelectedCategory("women")}>women's</a> */}
                                        <Link to={`/${categories,"women"}`}>  women's</Link>
                                        {/* onClick={() => setSelectedCategory(category.categoryname)} */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div
                                    className="banner_item align-items-center"
                                    style={{ backgroundImage: "url(images/banner_2.jpg)" }}
                                >
                                    <div className="banner_category">
                                   
                                        <Link to={`/${categories,"kids"}`}>  kids</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div
                                    className="banner_item align-items-center"
                                    style={{ backgroundImage: "url(images/banner_3.jpg)" }}
                                >
                                    <div className="banner_category">
                                    <Link to={`/${categories,"mens"}`}>Mens</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Arrivals */}
                <div className="new_arrivals">
                    <div className="container">
                        <div className="row">
                            <div className="col text-center">
                                <div className="section_title new_arrivals_title">
                                    <h2>New Arrivals</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col text-center">
                                <div className="new_arrivals_sorting">
                                    <ul className="arrivals_grid_sorting clearfix button-group filters-button-group">
                                        <li
                                            className={`grid_sorting_button button d-flex flex-column justify-content-center align-items-center ${selectedCategory === 'all' ? 'active' : ''}`}
                                            onClick={() => setSelectedCategory('all')}
                                        >
                                            All
                                        </li>
                                        {activeCategories.map((category) => (
                                            <li
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.categoryname)}
                                                className={`grid_sorting_button button ml-2 d-flex flex-column justify-content-center align-items-center ${selectedCategory === category.categoryname ? 'active' : ''}`}
                                            >
                                                {category.categoryname}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="product-grid d-flex flex-wrap justify-content-right align-items-row">
                                    {/* Pass the filtered products to CardsNew */}
                                    <CardsNew products={filteredProducts} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                

                {/* Benefits */}
                <Benefits />

                {/* Newsletter */}
                <Newsletter />

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default Web;
