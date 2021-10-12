import './App.css';

import {useState} from 'react'

const Checkout = ({cart, rules}) => {
	const cartWithRules = applyRules(cart, rules);
	const total = getTotal(cartWithRules);

	return (
		<table className="totals">
			<tbody>
			<tr>
				<th scope="row">Total</th>
				<td data-testid="total">{total}</td>
			</tr>
			</tbody>
		</table>
	);
};

const App = () => {
	const [cart, setCart] = useState([]);
	const [rules, setRules] = useState([
		{type: 'buy-one-get-one-free-discount', sku: 'LB1'},
		{type: 'bulk-discount', sku: 'CS1', minimumOrders: 3, newPrice: 4.5},
	]);

	const addLightBulb = () => {
		setCart(prev => [...prev, addProduct('LB1', 3.11)])
	};

	const addChessSet = () => {
		setCart(prev => [...prev, addProduct('CS1', 5)])
	};

	const addHousePlant = () => {
		setCart(prev => [...prev, addProduct('HP1', 11.23)])
	};

	return (
		<div className="App">
			<div className="cart">
				<button data-testid={'light-bulb-button'} onClick={addLightBulb}>Light bulb</button>
				<button data-testid={'chess-set-button'} onClick={addChessSet}>Chess set</button>
				<button data-testid={'house-plant-button'} onClick={addHousePlant}>House plant</button>
			</div>
			<Checkout cart={cart} rules={rules}/>
		</div>
	);
};

export const addProduct = (sku, price) => ({sku, qty: 1, price});

export const getTotal = (cart) => {
	let total = 0;

	cart.map(item => {
		total += item.price;
	});

	return `£${Number(parseFloat(total).toFixed(2))}`;
};

export const applyRules = (cart = [], rules = []) => {
	for (const rule of rules) {
		if (rule.type === 'buy-one-get-one-free-discount') {
			cart = buyOneGetOneFreeDiscount(cart, rule.sku);
		}

		if (rule.type === 'bulk-discount') {
			cart = bulkDiscount(cart, rule.sku, rule.minimumOrders, rule.newPrice);
		}
	}

	return cart;
};

export const buyOneGetOneFreeDiscount = (cart = [], sku) => {
	if (!sku) {
		return cart;
	}

	return cart.map(item => {
		if (item.sku === sku) {
			return {
				...item,
				qty: item.qty === 1 ? 2 : item.qty
			};
		}

		return item;
	})
};

export const bulkDiscount = (cart, sku, minimumOrders, price) => {
	if (!sku || !minimumOrders || !price) {
		return cart;
	}

	const totalOrders = cart.filter(item => item.sku === sku).length;

	if (totalOrders < minimumOrders) {
		return cart;
	}

	return cart.map(item => {
		if (item.sku === sku) {
			return {
				...item,
				price
			};
		}

		return item;
	})
};

export default App;
