export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  paymentMethod: 'COD' | 'Prepaid';
  timestamp: Date;
  status: 'Genuine' | 'Fake';
  riskScore: number;
  detectionReasons: string[];
}

export interface DetectionResult {
  status: 'Genuine' | 'Fake';
  riskScore: number;
  reasons: string[];
  confidence: number;
  gatewayAnalysis?: {
    gateway: string;
    accessRate: number;
    cancellationRate: number;
    successRate: number;
  };
}

export interface Analytics {
  totalOrders: number;
  fakeOrders: number;
  genuineOrders: number;
  fakePercentage: number;
  topSuspiciousPhones: Array<{ phone: string; count: number }>;
  paymentMethodStats: {
    cod: { total: number; fake: number };
    prepaid: { total: number; fake: number };
  };
}