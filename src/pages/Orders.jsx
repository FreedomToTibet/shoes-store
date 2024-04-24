import React, { useEffect, useState } from "react";
import axios from "axios";

import Card from "../components/Card";
import Info from "../components/Info";

export default function Orders() {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(
					"https://62f80b4873b79d0153626d9b.mockapi.io/orders"
				);
				setOrders(data.map((obj) => obj.items).flat());

				setIsLoading(false);
			} catch (error) {
				alert("Error requesting orders");
				console.log(error);
			}
		})();
	}, []);

	return (
		<div className="conten p-40">
			<div className="d-flex align-center mb-40 justify-between">
				<h1 className="">My purchases</h1>
			</div>
			<div className="content__sneakers d-flex flex-wrap">

				{(isLoading ? [...Array(12)] : orders).map((item, index) => {
					return <Card key={index} loading={isLoading} {...item} />;
				})}
				{!orders.length > 0 && !isLoading && (
					<Info
						title="You have no orders"
						description="To see your purchases, order at least once."
						image="./img/smileDown.svg"
					/>
				)}
			</div>
		</div>
	);
};

