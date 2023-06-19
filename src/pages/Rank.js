import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Rank() {
  const [level, setLevel] = useState("hard");
  const [myscore, setMyscore] = useState("");
  const [data, setData] = useState([
    // {
    //   tier: "다이아",
    //   nickname: "태황무임중",
    //   score: "10000000000",
    //   date: "2023.03.12",
    // },
    // {
    //   tier: "플래티넘",
    //   nickname: "벚꽃놀이",
    //   score: "5000000",
    //   date: "2023.03.12",
    // },
    // {
    //   tier: "골드",
    //   nickname: "가라아게",
    //   score: "40000",
    //   date: "2023.03.12",
    // },
    // {
    //   tier: "실버",
    //   nickname: "빠삐코",
    //   score: "3000",
    //   date: "2023.03.12",
    // },
    // {
    //   tier: "브론즈",
    //   nickname: "강남",
    //   score: "2000",
    //   date: "2023.03.12",
    // },
  ]);

  const dateParser = (string) => {
    const dateString = string;
    const date = new Date(dateString);

    // 날짜 부분 추출
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // 포맷된 날짜 출력
    const formattedDate = `${year}년 ${month}월 ${day}일`;
    console.log(formattedDate);
    return formattedDate;
  };

  const getData = async () => {
    console.log("level", level);
    try {
      const response = await axios.get("/userScores/ckscoreBefore", {
        params: {
          level,
        },
      });
      // console.log(response.status);
      console.log(response.data); // 로그인 성공 시 받아온 데이터 처리

      // 데이터 셋
      setData(response.data);
    } catch (error) {
      console.error(error); // 에러 처리
      alert(error);
      // if (error.code !== 200 && error.code === 401) {
      //   alert(`${error.response.data.message}`);
      // } else {
      //   alert(error);
      // }
    }
  };

  const myscoreGet = async () => {
    try {
      const response = await axios.get("/userScores/cbScore");
      console.log(response.status);
      console.log(response.data); // 로그인 성공 시 받아온 데이터 처리
      setMyscore(response.data); // 내 스코어
    } catch (error) {
      console.error(error); // 에러 처리
      if (error.code !== 200 && error.code === 401) {
        alert(`${error.response.data.message}`);
      } else {
        alert(error);
      }
    }
  };

  // 최초 1회 호출
  useEffect(() => {
    getData();
    // myscoreGet();
  }, []);

  return (
    <div className="rank">
      <h1>랭킹</h1>
      <p>내 스코어 : {myscore}</p>
      <button type="button" onClick={myscoreGet}>
        가져오기
      </button>
      <div className="body-content">
        <div className="navbar">
          <span className="lv">난이도</span>
          <button
            className="lv-btn"
            type="button"
            onClick={() => {
              setLevel("hard");
              getData();
            }}
          >
            어려움
          </button>
          <button
            className="lv-btn"
            type="button"
            onClick={() => {
              setLevel("normal");
              getData();
            }}
          >
            보통
          </button>
          <button
            className="lv-btn"
            type="button"
            onClick={() => {
              setLevel("easy");
              getData();
            }}
          >
            쉬움
          </button>
        </div>
        <div className="table-box">
          <table className="rank-table">
            <tbody>
              <tr>
                <th>순위</th>
                <th>티어</th>
                <th>닉네임</th>
                <th>점수</th>
                <th>갱신일</th>
              </tr>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.tier}</td>
                    <td>{item.nickname}</td>
                    <td>{item.score}</td>
                    <td>{dateParser(item.date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
