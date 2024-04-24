import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Route, Routes} from 'react-router-dom';

import Drawer from './components/Drawer';
import Header from './components/Header';
import Home from './pages/Home.jsx';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';
import AppContext from '../src/context';

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cartRespons, favoritesRespons, itemsRespons] = await Promise.all([
          axios.get('https://62f80b4873b79d0153626d9b.mockapi.io/cart'),
          axios.get('https://62f80b4873b79d0153626d9b.mockapi.io/favorites'),
          axios.get('https://62f80b4873b79d0153626d9b.mockapi.io/goods'),
        ]);

        setIsLoading(false);

        setCartItems(cartRespons.data);
        setFavorites(favoritesRespons.data);
        setItems(itemsRespons.data);
      } catch (error) {
        alert('Error requesting data :(');
        console.log(error);
      }
    }
    fetchData();
  }, []);

  items.map((item, i) => {
    return (item.idItem = `${i + 1}`);
  });

  const onAddToCart = async (obj) => {
    const findItem = cartItems.find(
      (cartObj) => Number(cartObj.idItem) === Number(obj.idItem),
    );
    try {
      if (findItem) {
        setCartItems((prev) =>
          prev.filter((item) => Number(item.idItem) !== Number(obj.idItem)),
        );
        await axios.delete(
          `https://62f80b4873b79d0153626d9b.mockapi.io/cart/${findItem.id}`,
        );
      } else {
        setCartItems((prev) => [...prev, obj]);
        const {data} = await axios.post(
          'https://62f80b4873b79d0153626d9b.mockapi.io/cart',
          obj,
        );
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.idItem === data.idItem) {
              return {...item, id: data.id};
            }
            return item;
          }),
        );
      }
    } catch (error) {
      alert('Failed to add item to cart');
      console.log(error);
    }
  };

  const onRemoveItem = async (idItem, id) => {
    try {
      setCartItems((prev) =>
        prev.filter((item) => Number(item.idItem) !== Number(idItem)),
      );
      const {data} = await axios.delete(
        `https://62f80b4873b79d0153626d9b.mockapi.io/cart/${id}`,
      );

      setCartItems((prev) =>
        prev.map((item) => {
          if (item.idItem === data.idItem) {
            return {...item, id: data.id};
          }
          return item;
        }),
      );
    } catch (error) {
      alert('Failed to remove item from cart');
      console.log(error);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const onAddToFavorite = async (obj) => {
    const findItemFav = favorites.find(
      (item) => Number(item.idItem) === Number(obj.idItem),
    );
    try {
      if (findItemFav) {
        setFavorites((prev) =>
          prev.filter((item) => Number(item.idItem) !== Number(obj.idItem)),
        );
        axios.delete(
          `https://62f80b4873b79d0153626d9b.mockapi.io/favorites/${findItemFav.id}`,
        );
      } else {
        setFavorites((prev) => [...prev, obj]);
        const {data} = await axios.post(
          'https://62f80b4873b79d0153626d9b.mockapi.io/favorites',
          obj,
        );
        console.log('data', data);
        setFavorites((prev) =>
          prev.map((item) => {
            if (item.idItem === data.idItem) {
              return {...item, id: data.id};
            }
            return item;
          }),
        );
      }
    } catch (error) {
      alert('Failed to add product to bookmarks');
      console.log(error);
    }
  };

  const isItemAdded = (idItem) => {
    return cartItems.some((obj) => Number(obj.idItem) === Number(idItem));
  };

  const isItemLiked = (idItem) => {
    return favorites.some((obj) => Number(obj.idItem) === Number(idItem));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        isItemLiked,
        isLoading,
        setCartOpened,
        setCartItems,
      }}
    >
      <div className="wrapper clear">
        <Drawer
          opened={cartOpened}
          onRemove={onRemoveItem}
          items={cartItems}
          onClose={() => setCartOpened(false)}
        />

        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route
            path={''}
            element={
              <Home
                items={items}
                searchValue={searchValue}
                onChangeSearchInput={onChangeSearchInput}
                setSearchValue={setSearchValue}
                onAddToCart={onAddToCart}
                onAddToFavorite={onAddToFavorite}
                isLoading={isLoading}
              />
            }
            exact="true"
          />
          <Route
            path={'favorites'}
            element={
              <Favorites onAddToCart={onAddToCart} onAddToFavorite={onAddToFavorite} />
            }
            exact
          />
          <Route
            path={'orders'}
            element={
              <Orders onAddToCart={onAddToCart} onAddToFavorite={onAddToFavorite} />
            }
            exact
          />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
