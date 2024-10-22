import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../context/Auth';
import { auth } from '../assets/Utills/firebase';
import { CartContext } from '../context/CartContext';

function Header() {
  const { cartitem } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const logoutUser = async () => {
    await signOut(auth);
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="header trans_300">
        {/* Top Navigation */}
        <div className="top_nav">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="top_nav_left">
                  Free shipping on all U.S orders over $50
                </div>
              </div>
              <div className="col-md-6 text-right">
                <div className="top_nav_right">
                  <ul className="top_nav_menu">
                    <li className="currency">
                      <Link to="/admin/products">Back To Dashboard</Link>
                    </li>
                    <li className="account">
                      {user?.islogin ? (
                        <>
                          <a href="#">
                            {user?.userinfo?.email}
                            <i className="fa fa-angle-down"></i>
                            <img
                              width={"30px"}
                              className="mx-2 avatar rounded-4 avatar-lg"
                              src={user?.userinfo?.photo}
                              alt="User Avatar"
                            />
                          </a>
                          <ul className="account_selection">
                            <li onClick={logoutUser}>
                              <Link to="/">
                                <i
                                  className="fa fa-user-plus"
                                  aria-hidden="true"
                                ></i>
                                Logout
                              </Link>
                            </li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <a href="#">My Account</a>
                          <ul className="account_selection">
                            <li>
                              <Link to="signin">
                                <i
                                  className="fa fa-sign-in"
                                  aria-hidden="true"
                                ></i>
                                Sign In
                              </Link>
                            </li>
                            <li>
                              <Link to="register">
                                <i
                                  className="fa fa-user-plus"
                                  aria-hidden="true"
                                ></i>
                                Register
                              </Link>
                            </li>
                          </ul>
                        </>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="main_nav_container">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-right">
                <div className="logo_container">
                  <Link to="/web">
                    colo<span>shop</span>
                  </Link>
                </div>
                <nav className="navbar">
                  <ul className={`navbar_menu ${isMenuOpen ? 'active' : ''}`}>
                    <li>
                      <Link to="/web">home</Link>
                    </li>
                    <li>
                      <a href="#">shop</a>
                    </li>
                    <li>
                      <a href="#">promotion</a>
                    </li>
                    <li>
                      <a href="#">pages</a>
                    </li>
                    <li>
                      <a href="#">blog</a>
                    </li>
                    <li>
                      <a href="contact.html">contact</a>
                    </li>
                  </ul>
                  <ul className="navbar_user">
                    <li>
                      <a href="#">
                        <i className="fa fa-search" aria-hidden="true" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-user" aria-hidden="true" />
                      </a>
                    </li>
                    <li className="checkout">
                      <Link to="/cart">
                        <i className="fa fa-shopping-cart" aria-hidden="true" />
                        <span id="checkout_items" className="checkout_items">
                          {cartitem.length}
                        </span>
                      </Link>
                    </li>
                  </ul>

                  {/* Hamburger Menu Icon */}
                  <div className="hamburger_container" onClick={toggleMenu}>
                    <i className="fa fa-bars" aria-hidden="true" />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fs_menu_overlay" onClick={toggleMenu} />
        )}

        {/* Mobile Hamburger Menu */}
        <div className={`hamburger_menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="hamburger_close" onClick={toggleMenu}>
            <i className="fa fa-times" aria-hidden="true" />
          </div>
          <div className="hamburger_menu_content text-right">
            <ul className="menu_top_nav">
              <li className="menu_item">
                <Link to="/web">home</Link>
              </li>
              <li className="menu_item">
                <a href="#">shop</a>
              </li>
              <li className="menu_item">
                <a href="#">promotion</a>
              </li>
              <li className="menu_item">
                <a href="#">pages</a>
              </li>
              <li className="menu_item">
                <a href="#">blog</a>
              </li>
              <li className="menu_item">
                <a href="#">contact</a>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
