// src/pages/SavePage.tsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { HeaderBar } from '../components/Layout';
import FlikCard from '../components/Feed/FlikCard';
import { useAuthStore } from '../stores/authStore';
import { BackArrowIcon } from '../components/Icons/SvgIcons';
import { SpotDetail, convertToSpot } from '../types/spot.types';
import { useLocation, useNavigate } from 'react-router-dom';


const SpotDetailCardPage: React.FC = () => {
  const location = useLocation();
  const spotDetail = location.state?.spotDetail as SpotDetail | undefined;
  const navigate = useNavigate();
  const { spotId } = useParams<{ spotId: string }>();
  if (!spotDetail) {
    return <div>Spot not found</div>;
  }
  const spot = convertToSpot(spotDetail);

  console.log('받은 spot 데이터:', spot); // 디버깅
  console.log('URL spotId:', spotId); //

  return (
    <div className="h-screen bg-gray-50 flex flex-col">

        <HeaderBar variant="logo" />

    
        <main className="pt-header-default bg-white max-w-7xl sm:mx-[1%] xs:mx-[3%] px-2 lg:px-8 flex flex-col flex-1 overflow-hidden">
        {/* 페이지 제목 */}
        <div className="sm:py-[3%] xs:pb-[5%] px-[1%] h-[80%]">
          <div className="flex items-center justify-between sm:mb-[5%] xs:mb-[2%]"
          onClick={() => navigate(-1)}
          >
            <BackArrowIcon size="lg"/>
          </div>

          <FlikCard spot={spot} />

        </div>

        
        
      </main>
    </div>
  );
};



export default SpotDetailCardPage;