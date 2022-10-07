/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./App.css";

const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [usersRenders, setUsersRenders] = useState([]);
  const [cursor, setCursor] = useState(0);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const [hovered, setHovered] = useState(undefined);

  function searchUsers(params) {
    let result = [];
    if (params) {
      users.forEach((user) => {
        if (user.name.match(params) || user.phone.match(params)) {
          result.push(user);
        }
      });
      setUsersRenders(result);
      return;
    }
    setUsersRenders(users);
    return;
  }

  useEffect(() => {
    if (usersRenders.length && downPress) {
      setCursor((prevState) =>
        prevState < usersRenders.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress]);

  useEffect(() => {
    if (usersRenders.length && upPress) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);

  useEffect(() => {
    if (usersRenders.length && hovered !== undefined) {
      setCursor(hovered);
    }
  }, [hovered]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((res) => {
        setUsers(res);
        setUsersRenders(res);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container">
      {isLoading ? (
        <div className="loading"></div>
      ) : (
        <>
          <h1 className="title">Contact User</h1>
          <input
            type="text"
            placeholder="Please input name or phone . . ."
            onChange={(e) => searchUsers(e.target.value)}
          />
          <div className="content">
            {usersRenders.length > 0 ? (
              usersRenders.map((item, i) => {
                return (
                  <div
                    key={i}
                    className={`list-user ${i === cursor ? "active" : ""}`}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(undefined)}
                  >
                    <div className="user-name">{item.name}</div>
                    <a href={`tel:${item.phone}`} className="user-phone">
                      {item.phone}
                    </a>
                    <a href={`mailto:${item.email}`} className="user-phone">
                      {item.email}
                    </a>
                  </div>
                );
              })
            ) : (
              <div>No results</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
