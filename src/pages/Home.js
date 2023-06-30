import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import isLogin from "../util/isLogin";
import Header from "../components/account/Header";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = isLogin();
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
  }, []);

  // 모달 창을 여는 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  const clickStart1 = () => {
    navigate("/level");
  };
  const clickStart2 = () => {
    navigate("/WaitingRoom");
  };

  return (
    <>
      {/* 헤더 */}
      <Header isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      {/* 메인페이지 */}
      <div className="home">
        <div className="box-whole">
          <div className="box-title-gamescreen">
            <div className="home-title">
              <b>WELCOME TO WONDERLAND</b>
            </div>
            {isLoggedIn ? (
              <div className="gameScreen">
                <button onClick={clickStart1} className="game-link1" />
                <button onClick={clickStart2} className="game-link2" />
              </div>
            ) : (
              <div onClick={openModal} className="gameScreen">
                <button className="game-link" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
