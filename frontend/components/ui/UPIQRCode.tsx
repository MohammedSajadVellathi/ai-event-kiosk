"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface UPIQRCodeProps {
  upiString: string;
  amount: number;
  size?: number;
}

export function UPIQRCode({ upiString, amount, size = 200 }: UPIQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !upiString) return;
    QRCode.toCanvas(canvas, upiString, {
      width: size,
      margin: 1,
      color: { dark: "#ffffff", light: "#00000000" },
      errorCorrectionLevel: "M",
    }).catch(() => {});
  }, [upiString, size]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <canvas ref={canvasRef} width={size} height={size} />
      </div>

      <div className="text-center space-y-1">
        <p className="text-yellow-400 text-2xl font-light">₹{amount}</p>
        <p className="text-white/30 text-xs tracking-widest uppercase">
          Scan with GPay · PhonePe · Paytm
        </p>
      </div>
    </div>
  );
}
