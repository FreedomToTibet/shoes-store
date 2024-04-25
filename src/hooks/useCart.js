import { useContext } from "react";

import AppContext from "../context";

export const useCart = () => {
	const { cartItems, favorites, setCartItems } = useContext(AppContext);
	const totalPrice = Number(cartItems.reduce(
		(sum, obj) => Number(sum) + Number(obj.price),
		0
	).toFixed(2));
	
	return { cartItems, favorites, setCartItems, totalPrice };
};