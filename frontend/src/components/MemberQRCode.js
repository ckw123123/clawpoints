import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const MemberQRCode = ({ memberId, memberName, size = 160 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const generateQRCode = async () => {
      if (canvasRef.current) {
        try {
          // Create unique QR data for each member
          const qrData = JSON.stringify({
            type: 'member',
            id: memberId,
            name: memberName,
            timestamp: Date.now()
          });

          // Generate QR code on canvas
          await QRCode.toCanvas(canvasRef.current, qrData, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQRCode();
  }, [memberId, memberName, size]);

  return (
    <div className="flex justify-center">
      <canvas 
        ref={canvasRef}
        className="border border-gray-200 rounded-lg"
      />
    </div>
  );
};

export default MemberQRCode;