import { render, screen, fireEvent } from '@testing-library/react';
import App, {addProduct, buyOneGetOneFreeDiscount, bulkDiscount, applyRules} from './App';

test('total starts at zero', () => {
  render(<App />);

  expect(screen.getByTestId('total')).toHaveTextContent('0');
});

test('add product to return an object with sku, qty, and price', () => {
  const sku = 'LB1';
  const price = 4.5;

  const object = addProduct('LB1', 4.5);

  expect(typeof object === 'object').toBeTruthy();
  expect(object).toEqual({sku, qty: 1, price});
});

test('buy one get one free for cart with 2 items with sku LB1', () => {
  const sku = 'LB1';
  const price = 3;

  const cart = [
    {sku, qty: 1, price},
    {sku, qty: 1, price}
  ];

  const updatedCart = buyOneGetOneFreeDiscount(cart, sku);

  for (const item of updatedCart) {
    expect(item.qty).toBe(2);
  }
});

test('buy one get one free for cart with 2 items with sku LB1, and not changing for other sku', () => {
  const sku = 'LB1';
  const price = 3;

  const checkSku = 'LS1';
  const cart = [
    {sku, qty: 1, price},
    {sku, qty: 1, price},
    {sku: checkSku, qty: 1, price: 4.5},
  ];

  const updatedCart = buyOneGetOneFreeDiscount(cart, sku);

  for (const item of updatedCart) {
    if (item.sku === checkSku) {
      expect(item.qty).toBe(1);
    }
  }
});

test('bulk discount for cart with 2 items with sku LB1 with minimum orders of 3', () => {
  const sku = 'LB1';
  const price = 3;

  const cart = [
    {sku, qty: 1, price},
    {sku, qty: 1, price}
  ];

  const updatedCart = bulkDiscount(cart, sku, 3, 2);

  expect(updatedCart).toStrictEqual(cart);
});

test('bulk discount for cart with 3 items with sku LB1 with minimum orders of 3', () => {
  const sku = 'LB1';
  const price = 3;

  const bulkPrice = 2;

  const cart = [
    {sku, qty: 1, price},
    {sku, qty: 1, price},
    {sku, qty: 1, price}
  ];

  const updatedCart = bulkDiscount(cart, sku, 3, bulkPrice);

  for (const item of updatedCart) {
    expect(item.price).toBe(bulkPrice);
  }
});

test('applied rules to be applied correctly', () => {
  const cart = [
    {sku: 'LB1', qty: 1, price: 3},
    {sku: 'LB1', qty: 1, price: 3},
    {sku: 'LB1', qty: 1, price: 3},
    {sku: 'CS1', qty: 1, price: 5},
    {sku: 'CS1', qty: 1, price: 5},
    {sku: 'PT1', qty: 1, price: 10},
  ];

  const rules = [
    {type: 'buy-one-get-one-free-discount', sku: 'LB1'},
    {type: 'bulk-discount', sku: 'CS1', minimumOrders: 2, newPrice: 4},
  ];

  const updatedCart = applyRules(cart, rules);

  for (const item of updatedCart) {
    if (item.sku === 'LB1') {
      expect(item.qty).toBe(2);
      expect(item.price).toBe(3);
    }

    if (item.sku === 'CS1') {
      expect(item.qty).toBe(1);
      expect(item.price).toBe(4);
    }

    if (item.sku === 'PT1') {
      expect(item.qty).toBe(1);
      expect(item.price).toBe(10);
    }
  }
});

test('add LB1 (qty 2) expect the total to be £3.11', () => {
  render(<App />);

  fireEvent.click(screen.getByTestId('light-bulb-button'));

  expect(screen.getByTestId('total')).toHaveTextContent('£3.11');
});

test('add CS1, CS1, LB1 (qty 2), CS1 expect the total to be £16.61', () => {
  render(<App />);

  fireEvent.click(screen.getByTestId('chess-set-button'));
  fireEvent.click(screen.getByTestId('chess-set-button'));
  fireEvent.click(screen.getByTestId('light-bulb-button'));
  fireEvent.click(screen.getByTestId('chess-set-button'));

  expect(screen.getByTestId('total')).toHaveTextContent('£16.61');
});

test('add LB1 (qty 2), CS1, LB1, HP1 expect the total to be £22.45', () => {
  render(<App />);

  fireEvent.click(screen.getByTestId('light-bulb-button'));
  fireEvent.click(screen.getByTestId('chess-set-button'));
  fireEvent.click(screen.getByTestId('light-bulb-button'));
  fireEvent.click(screen.getByTestId('house-plant-button'));

  expect(screen.getByTestId('total')).toHaveTextContent('£22.45');
});
