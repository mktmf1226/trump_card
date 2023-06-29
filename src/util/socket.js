import { io } from "socket.io-client";

const socket = io(`${process.env.REACT_APP_SERVER_DASEUL_URL}`);
// const socket = io(`${process.env.REACT_APP_SERVER_JIHYUN_URL}`);

export default class {
  // 클라이언트에서 소켓 연결 설정
  // 소켓 연결 이벤트
  static connect(userNick) {
    // console.log(`Connect user name is ,`, userNick);
    socket.emit("signin", userNick);
  }

  // 방 입장 이벤트
  static joinRoom(data) {
    const params = {
      userNick: data.userNick,
      room: data.room,
    };
    socket.emit("join", params);
  }

  // 메시지 수신 이벤트
  static receiveMsg(setConversations) {
    socket.on("message", (data) => {
      const { sender, message, room } = data;
      // setConversations((prevConversations) => {
      //   const newConversations = [...prevConversations];
      //   newConversations.push(`${sender}: ${message}`);
      // });
      setConversations((prevConversations) => [
        ...prevConversations,
        `${sender}: ${message}`,
      ]);
    });
  }

  // admin 메시지 수신 이벤트
  static receiveAminMsg(setAdminMsg) {
    socket.on("adminMessage", (data) => {
      // console.log("1", data);
      setAdminMsg((prevAdminMsg) => [...prevAdminMsg, data.message]);
    });
  }

  // 메시지 전송 이벤트
  static sendMsg(data) {
    const params = {
      message: data.message,
      sender: data.sender,
      room: data.room,
    };
    socket.emit("sendMessage", params);
  }

  // // 사용자 리스트 제공 이벤트
  // static sendUserList(title, userList) {
  //   socket.emit("user list", { title, users: userList });
  // }

  // 채팅방 퇴장 이벤트
  static leaveRoom(data) {
    const params = {
      userNick: data.userNick,
      room: data.room,
    };
    socket.emit("leave", params);
  }

  // 소켓 연결 해제 이벤트
  static disconnect(userNick) {
    socket.disconnect(userNick);
  }

  // 게임 시작 트리거 보내기 이벤트
  static start(data) {
    const params = {
      room: data.room,
      words: data.words,
    };
    socket.emit("startGame", params);
  }

  // 게임 받기 이벤트
  static receiveStartMsg(
    initializeGame,
    setArrayWords,
    setNextLocation,
    setCurrentLocation,
    setRound,
    setCurrentPlayerIndex,
    setUserInputs,
    setConversations
  ) {
    socket.on("startGame", (data) => {
      const { room, words } = data;
      setArrayWords(words);
      initializeGame();

      // 타임아웃 발생 시 다음 인덱스의 글자 보여주기
      socket.on("timeout", (timeoutData) => {
        const { currentPlayerIndex, suggestWords, players, roundLimit } =
          timeoutData;
        const nextIndex = (currentPlayerIndex + 1) % players.length;
        const nextLocation = suggestWords[nextIndex];

        if (roundLimit > 0) {
          setNextLocation(nextLocation);
        } else {
          // 게임 종료 처리
          setCurrentLocation(""); // 현재 위치 초기화
          setRound(1); // 라운드 초기화
          setCurrentPlayerIndex((prevIndex) => prevIndex + 1); // 다음 플레이어 인덱스로 설정
          setUserInputs([]); // 사용자 입력 초기화
          setConversations([]); // 대화 초기화
        }
      });
    });
  }

  // 다음 스텝 보내기 이벤트
  static sendNextStep(data) {
    const params = {
      room: data.room,
    };
    socket.emit("sendNextStep", params);
  }

  // 다음 스텝 받기 이벤트
  static listenNextStep() {
    socket.on("listenNextStep", (data) => {
      const { room } = data;
    });
  }

  // 게임 종료 보내기 이벤트
  static sendEndGame(data) {
    const params = {
      room: data.room,
    };
    socket.emit("sendEndGame", params);
  }

  // 게임 종료 받기 이벤트
  static listenEndGame() {
    socket.on("listenEndGame", (data) => {
      const { room } = data;
    });
  }
}
