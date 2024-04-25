import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

import { useCart } from "../../hooks/useCart";
import Info from "../Info";

import styles from "./Drawer.module.scss";

export default function Drawer({ onClose, onRemove, items = [], opened }) {
  const { cartItems, setCartItems, totalPrice } = useCart();
  const [isOrderComplited, setIsOrderComplited] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "https://62f80b4873b79d0153626d9b.mockapi.io/orders",
        { items: cartItems }
      );

      setOrderId(data.id);
      setIsOrderComplited(true);
      setCartItems([]);

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete(
          "https://62f80b4873b79d0153626d9b.mockapi.io/cart/" + item.id
        );
      }
    } catch (error) {
      alert("Error creating an order :(");
      console.log(error);
    }
    setIsLoading(false);
		setTimeout(() => {
			setIsOrderComplited(false);
			onClose();
		}, 3000);
  };

	useEffect(() => {
    if (opened) {
      document.body.style.overflow = 'hidden'; // Enables scrolling
    } else {
      document.body.style.overflow = 'auto'; // Disables scrolling
    }
  }, [opened]);

  return (
    <div
      onClick={onClose}
      className={`${styles.overlay} ${opened ? styles.overlayVisible : ""}`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={styles.overlayDrawer}
      >
        <h2 className="mb-30 d-flex justify-between">
          Cart
          <img
            onClick={onClose}
            className={styles.remove}
            src="./img/xButton.svg"
            alt="Remove"
          />
        </h2>

        {items.length > 0 ? (
          <Fragment>
            <div className={styles.overlayItems}>
              {items.map((obj, index) => {
                return (
                  <div key={index} className={styles.cart}>
                    <div
                      style={{ backgroundImage: `url(${obj.img})` }}
                      className={styles.cartImg}
                    ></div>
                    <div className="mr-20 flex">
                      <p className="mb-5">{obj.name}</p>
                      <b>{obj.price} $.</b>
                    </div>
                    <img
                      onClick={() => onRemove(obj.idItem, obj.id)}
                      className={styles.remove}
                      src="./img/xButton.svg"
                      alt="Remove"
                    />
                  </div>
                );
              })}
            </div>

            <div className={styles.overlayTotal}>
              <ul>
                <li className="d-flex">
                  <span>Final price: </span>
                  <div></div>
                  <b>{totalPrice} $. </b>
                </li>
                <li className="d-flex">
                  <span>Tax 5%: </span>
                  <div></div>
                  <b>{Math.ceil(totalPrice * 0.05)} $. </b>
                </li>
              </ul>
              <button
                disabled={isLoading}
                onClick={onClickOrder}
                className={styles.greenButton}
              >
                Place an order
                <img src="./img/arrow.svg" alt="arrow" />
              </button>
            </div>
          </Fragment>
        ) : (
          <Info
            title={isOrderComplited ? "Order is done" : "Cart is empty"}
            description={
              isOrderComplited
                ? `Your order #${orderId} will be transferred to courier delivery soon`
                : "Add at least one pair of sneakers to order."
            }
            image={isOrderComplited ? "./img/done.svg" : "./img/cartEmpty.svg"}
          />
        )}
      </div>
    </div>
  );
};