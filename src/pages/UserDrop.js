import axios from "axios";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export default function UserDrop() {
  const navigate = useNavigate();
  const movePage = () => {navigate("/");};

  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [isChecked, setIsChecked] = useState(false); // 체크박스 상태
  const [showModal, setShowModal] = useState(false); // 모달
  // 모달 열기
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // No버튼 클릭시 모달창 닫기
  const handleNoButtonClick = () => {
    handleCloseModal();
  };
 
  // 체크박스 상태에 따라 버튼 활성화하기
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked); // 체크박스 상태 업데이트
  };


  // 로그아웃 처리
  useEffect(() => {
    // 새로고침 시 로그인 상태를 복원
    const getCookie = cookies.get("accessToken");
    if (!!getCookie === true) {
      // token이 빈 값이 아니라면
      setIsLoggedIn(true);
      axios.defaults.headers.common.Authorization = `Bearer ${getCookie}`;
    }
  }, []);

  // 쿠키 삭제 함수
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    deleteCookie("accessToken");
    // 헤더에서 Authorization 제거
    delete axios.defaults.headers.common.Authorization;
  };

  // axios 인스턴스 생성
  const api = axios.create({
    baseURL: "http://192.168.0.50:1788", // 서버 주소
    withCredentials: true, // CORS 요청 처리를 위한 옵션 설정
  });


  // 회원 탈퇴
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // 새로고침 막기
    const getCookie = cookies.get("accessToken");
    api.defaults.headers.common.Authorization = `Bearer ${getCookie}`;
    
    try{
      const response = await axios.delete('/userInfos/deleteInfo', {})
      console.log('회원 탈퇴가 성공적으로 처리되었습니다.');
      handleLogout()
      movePage()
      } catch (error) {
        // 회원 탈퇴가 실패한 경우에 실행할 코드를 작성합니다.
        console.error('회원 탈퇴 중 오류가 발생했습니다:', error);
      };
    };

  return (
    <div className="userdrop">
      <p className="title">회원 탈퇴</p>
      <p>이용 약관</p>
      <textarea className="textarea" defaultValue={`
        제4장 계약 해지 제11조 (계약 해지) 회원이 서비스 이용 계약을 해지 하고자
        할 때는 개인정보수정의 &apos;회원탈퇴&apos; 메뉴에서 회원탈퇴를
        신청하시면 됩니다. 탈퇴를 신청하시면 즉시 탈퇴처리가 완료되며, 탈퇴후
        7일 동안은 회사에 다시 가입하실 수 없습니다. 제12조 (탈퇴 회원의
        개인정보 이용) 1.회사는 회원정보를 회원이 탈퇴하는 시점으로부터 1년까지
        보유할 수 있습니다. 2.회사가 보관하고 있는 탈퇴 회원의 정보는 회원의
        가입이력관리와 지적재산권 관리,개인정보보호를 위해서만 활용할 수
        있습니다. 3.단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는
        아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
        -표시/광고에 관한 기록 : 6개월 -계약 또는 청약철회 등에 관한 기록 : 5년
        -대금결제 및 재화 등의 공급에 관한 기록 : 5년 제13조 (자격상실) 다음 각
        항의 사유에 해당하는 경우 회사는 사전 통보 없이, 이용계약을 해지하거나
        기간을 정하여 서비스 이용을 중지 또는 이용계약 해지 후 무기한 가입제한
        할 수 있습니다.
        `} />
      <br />
      <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
      <span>본문 내용에 동의합니다.</span>
      <button type="button" onClick={handleOpenModal} disabled={!isChecked}>탈퇴하기</button>
      {/* The Modal */}
      {showModal && (
      <div id="myModal" className="modal">
        {/* Modal content */}
        <div className="modal-content">
          <button
            className="close"
            onClick={handleCloseModal}
            type="button"
          >
            &times;
          </button>
          <p>정말 탈퇴하시겠습니까?</p>
          <button type="button" onClick={handleFormSubmit}>네</button>
          <button type="button" onClick={handleNoButtonClick}>아니요</button>
        </div>
      </div>
      )}
    </div>
  );
}
