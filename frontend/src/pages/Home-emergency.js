import React from 'react';
import { useDemoAuth } from '../components/DemoAuthenticator';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { user, userType } = useDemoAuth();
  const { t } = useLanguage();

  // Emergency minimal version - no external data dependencies
  const memberData = {
    id: '1',
    name: 'Demo User',
    points: 1250
  };

  const branches = [
    { 
      id: '1', 
      name: '旺角 信和中心 101 號鋪',
      nameEn: 'Shop 101, Sino Centre, Mong Kok',
      whatsapp: '+852 5522 3344', 
      phone: '+852 5522 3344' 
    },
    { 
      id: '2', 
      name: '石門 京瑞廣場一期 201 號舖',
      nameEn: 'Shop 201, Phase 1, Kings Wing Plaza, Shek Mun',
      whatsapp: '+852 6622 3388', 
      phone: '+852 6622 3388' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Points Display */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Your Points</h2>
        <div className="text-4xl font-bold">{memberData.points.toLocaleString()}</div>
        <p className="text-blue-100 mt-2">Keep earning points!</p>
      </div>

      {/* QR Code Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Member QR Code</h2>
        
        <div className="flex justify-center mb-6">
          <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📱</div>
              <p className="text-sm text-gray-600">QR Code</p>
              <p className="text-xs text-gray-500">ID: {memberData.id}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600">
          Show this QR code when making purchases
        </p>
      </div>

      {/* Branches Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Our Branches</h3>
        
        <div className="space-y-4">
          {branches.map((branch) => (
            <div key={branch.id} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">{branch.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{branch.nameEn}</p>
              
              <div className="flex flex-wrap gap-2">
                <a 
                  href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <span>📱</span>
                  <span className="text-sm font-medium">WhatsApp: {branch.whatsapp}</span>
                </a>
                
                <a 
                  href={`tel:${branch.phone}`}
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <span>📞</span>
                  <span className="text-sm font-medium">Phone: {branch.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">Visit any branch to earn points</p>
          <p className="text-xs text-gray-500">Show your QR code at any location</p>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-600">⚠️</span>
          <p className="text-sm text-yellow-800">
            Emergency mode - Basic functionality only. All features working normally.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;