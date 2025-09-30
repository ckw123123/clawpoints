import React from 'react';
import { useDemoAuth } from '../components/DemoAuthenticator';
import { useLanguage } from '../contexts/LanguageContext';
import { useSharedData } from '../contexts/SharedDataContext-no-storage';
import MemberQRCode from '../components/MemberQRCode';

const Home = () => {
  const { user, userType } = useDemoAuth();
  const { t, isChinese } = useLanguage();
  const { members } = useSharedData();

  // Find current user's member data
  const memberData = userType === 'user' ? members.find(m => m.username === 'john_doe') : null;

  // Only show for members - Admin/Sales are redirected to admin dashboard
  if (!memberData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Points Display - Clean and prominent like your original */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">{t('yourPoints')}</h2>
        <div className="text-4xl font-bold">{memberData.points.toLocaleString()}</div>
        <p className="text-blue-100 mt-2">{t('keepEarning')}</p>
      </div>

      {/* QR Code Display - Clean and centered like your original */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">{t('memberQRCode')}</h2>
        
        {/* Real QR Code - Auto-generated and unique */}
        <div className="mb-6">
          <MemberQRCode 
            memberId={memberData.id}
            memberName={memberData.name}
            size={200}
          />
        </div>

        {/* Simple instruction - clean and minimal */}
        <p className="text-center text-gray-600">
          {t('showQRCode')}
        </p>
      </div>

      {/* All Branches Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">{t('ourBranches')}</h3>
        
        <div className="space-y-6">
          {/* Branch 1 - Mong Kok Sino Centre */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              {isChinese ? '旺角 信和中心 101 號鋪' : 'Shop 101, Sino Centre, Mong Kok'}
            </h4>
            <div className="flex flex-wrap gap-2 text-sm">
              <a 
                href="https://wa.me/85255223344"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp: +852 5522 3344
              </a>
              <a 
                href="tel:+85255223344"
                className="flex items-center text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                Tel: +852 5522 3344
              </a>
            </div>
          </div>

          {/* Branch 2 - Shek Mun Kings Wing Plaza */}
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              {isChinese ? '石門 京瑞廣場一期 201 號舖' : 'Shop 201, Phase 1, Kings Wing Plaza, Shek Mun'}
            </h4>
            <div className="flex flex-wrap gap-2 text-sm">
              <a 
                href="https://wa.me/85266223388"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp: +852 6622 3388
              </a>
              <a 
                href="tel:+85266223388"
                className="flex items-center text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                Tel: +852 6622 3388
              </a>
            </div>
          </div>

          {/* Branch 3 - Mong Kok Argyle Centre */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              {isChinese ? '旺角中心一期 2樓 S66A' : 'Shop S66A, 2/F, Argyle Centre Phase 1, Mong Kok'}
            </h4>
            <div className="flex flex-wrap gap-2 text-sm">
              <a 
                href="https://wa.me/85299228833"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp: +852 9922 8833
              </a>
              <a 
                href="tel:+85299228833"
                className="flex items-center text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                Tel: +852 9922 8833
              </a>
            </div>
          </div>
        </div>

        {/* General Info */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">{t('visitAnyBranch')}</p>
          <p className="text-xs text-gray-500">{t('showQRCodeAtAnyLocation')}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;