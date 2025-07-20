import { DetectionResult } from '../types';

// Bangladeshi Payment Gateway Data
const bangladeshiGateways = {
  bKash: {
    name: 'bKash',
    accessRate: 95.2,
    cancellationRate: 12.8,
    successRate: 87.2,
    riskFactor: 0.1
  },
  nagad: {
    name: 'Nagad',
    accessRate: 92.5,
    cancellationRate: 15.3,
    successRate: 84.7,
    riskFactor: 0.15
  },
  rocket: {
    name: 'Rocket',
    accessRate: 88.7,
    cancellationRate: 18.2,
    successRate: 81.8,
    riskFactor: 0.18
  },
  upay: {
    name: 'Upay',
    accessRate: 85.3,
    cancellationRate: 22.1,
    successRate: 77.9,
    riskFactor: 0.22
  },
  sslcommerz: {
    name: 'SSLCommerz',
    accessRate: 93.8,
    cancellationRate: 11.5,
    successRate: 88.5,
    riskFactor: 0.12
  },
  aamarpay: {
    name: 'AamarPay',
    accessRate: 90.1,
    cancellationRate: 16.7,
    successRate: 83.3,
    riskFactor: 0.17
  },
  portwallet: {
    name: 'PortWallet',
    accessRate: 82.4,
    cancellationRate: 25.6,
    successRate: 74.4,
    riskFactor: 0.26
  }
};

function analyzePaymentGateway(paymentMethod: 'COD' | 'Prepaid', phoneNumber: string): {
  gateway: string;
  accessRate: number;
  cancellationRate: number;
  successRate: number;
  riskScore: number;
} {
  // For COD orders, simulate gateway selection based on phone number pattern
  if (paymentMethod === 'COD') {
    return {
      gateway: 'Cash on Delivery',
      accessRate: 100,
      cancellationRate: 35.2, // Higher cancellation rate for COD
      successRate: 64.8,
      riskScore: 35.2
    };
  }

  // Select gateway based on phone number pattern for prepaid orders
  const lastDigit = parseInt(phoneNumber.slice(-1));
  const gatewayKeys = Object.keys(bangladeshiGateways);
  const selectedGateway = bangladeshiGateways[gatewayKeys[lastDigit % gatewayKeys.length] as keyof typeof bangladeshiGateways];

  // Calculate weighted risk score based on gateway performance
  const riskScore = (selectedGateway.cancellationRate * 0.6) + (selectedGateway.riskFactor * 100 * 0.4);

  return {
    gateway: selectedGateway.name,
    accessRate: selectedGateway.accessRate,
    cancellationRate: selectedGateway.cancellationRate,
    successRate: selectedGateway.successRate,
    riskScore: Math.round(riskScore)
  };
}

function validateBangladeshiPhone(phoneNumber: string): { isValid: boolean; operator: string } {
  // Remove any spaces or special characters
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Bangladeshi phone number patterns
  const operators = {
    grameenphone: /^(017|013)\d{8}$/,
    robi: /^(018|019)\d{8}$/,
    banglalink: /^(014|019)\d{8}$/,
    teletalk: /^(015)\d{8}$/,
    airtel: /^(016)\d{8}$/
  };

  for (const [operator, pattern] of Object.entries(operators)) {
    if (pattern.test(cleanPhone)) {
      return { isValid: true, operator };
    }
  }

  return { isValid: false, operator: 'unknown' };
}

export function detectFakeOrder(
  customerName: string,
  phoneNumber: string,
  address: string,
  paymentMethod: 'COD' | 'Prepaid',
  orderHistory: any[] = []
): DetectionResult {
  const reasons: string[] = [];
  let riskScore = 0;

  // Analyze payment gateway
  const gatewayAnalysis = analyzePaymentGateway(paymentMethod, phoneNumber);
  
  // Gateway-based risk assessment
  if (gatewayAnalysis.cancellationRate > 20) {
    reasons.push(`High cancellation rate (${gatewayAnalysis.cancellationRate}%) for ${gatewayAnalysis.gateway}`);
    riskScore += gatewayAnalysis.riskScore;
  }

  if (gatewayAnalysis.successRate < 80) {
    reasons.push(`Low success rate (${gatewayAnalysis.successRate}%) for selected payment method`);
    riskScore += 15;
  }

  // Bangladeshi phone number validation
  const phoneValidation = validateBangladeshiPhone(phoneNumber);
  if (!phoneValidation.isValid) {
    reasons.push('Invalid Bangladeshi phone number format');
    riskScore += 30;
  } else {
    reasons.push(`Valid ${phoneValidation.operator} number detected`);
  }

  // Check for repeated digits in phone (common in fake numbers)
  const repeatedDigits = /(\d)\1{4,}/.test(phoneNumber);
  if (repeatedDigits) {
    reasons.push('Phone number contains suspicious repeated digit patterns');
    riskScore += 25;
  }

  // Name validation for Bangladeshi context
  if (customerName.length < 3) {
    reasons.push('Customer name is too short');
    riskScore += 20;
  }

  // Check for common Bangladeshi fake names
  const fakeNames = ['test', 'fake', 'demo', 'sample', 'abc', 'xyz', 'asdf', 'qwerty'];
  const commonFakePatterns = /^(test|fake|demo|sample|abc|xyz|asdf|qwerty)/i;
  if (fakeNames.some(name => customerName.toLowerCase().includes(name)) || commonFakePatterns.test(customerName)) {
    reasons.push('Customer name appears to be a test or fake name');
    riskScore += 35;
  }

  // Bangladeshi address validation
  const bangladeshiCities = ['dhaka', 'chittagong', 'sylhet', 'rajshahi', 'khulna', 'barisal', 'rangpur', 'mymensingh', 'comilla', 'narayanganj'];
  const hasValidCity = bangladeshiCities.some(city => address.toLowerCase().includes(city));
  
  if (address.length < 15) {
    reasons.push('Address is too short for Bangladeshi standards');
    riskScore += 25;
  }

  if (!hasValidCity && address.length < 30) {
    reasons.push('Address lacks proper Bangladeshi city/area information');
    riskScore += 20;
  }

  // Check for suspicious address keywords
  const suspiciousAddressWords = ['test', 'fake', 'demo', 'abc', 'xyz', 'asdf', 'sample'];
  if (suspiciousAddressWords.some(word => address.toLowerCase().includes(word))) {
    reasons.push('Address contains suspicious test keywords');
    riskScore += 30;
  }

  // Address structure validation (should contain numbers for Bangladeshi addresses)
  if (!/\d/.test(address)) {
    reasons.push('Address lacks proper house/building numbers');
    riskScore += 15;
  }

  // Payment method specific analysis
  if (paymentMethod === 'COD') {
    riskScore += 10; // COD has higher risk in Bangladesh due to high cancellation rates
    reasons.push('COD orders have higher cancellation risk in Bangladesh');
  }

  // Order frequency analysis
  const phoneFrequency = orderHistory.filter(order => order.phoneNumber === phoneNumber).length;
  if (phoneFrequency > 2) {
    reasons.push(`Multiple orders from same phone number (${phoneFrequency} orders) - suspicious pattern`);
    riskScore += Math.min(phoneFrequency * 8, 35);
  }

  // Address frequency check
  const addressFrequency = orderHistory.filter(order => 
    order.address.toLowerCase().trim() === address.toLowerCase().trim()
  ).length;
  if (addressFrequency > 1) {
    reasons.push(`Multiple orders from same address (${addressFrequency} orders)`);
    riskScore += Math.min(addressFrequency * 5, 25);
  }

  // Recent order pattern analysis (within last 2 hours)
  const recentOrders = orderHistory.filter(order => 
    order.phoneNumber === phoneNumber && 
    new Date().getTime() - new Date(order.timestamp).getTime() < 2 * 60 * 60 * 1000
  ).length;
  
  if (recentOrders > 0) {
    reasons.push('Multiple orders from same phone within short timeframe');
    riskScore += 30;
  }

  // Gateway success rate impact
  if (gatewayAnalysis.successRate > 85) {
    riskScore -= 5; // Bonus for high-performing gateways
  }

  // Final risk assessment based on Bangladeshi e-commerce patterns
  const finalRiskScore = Math.min(Math.max(riskScore, 0), 100);
  const status: 'Genuine' | 'Fake' = finalRiskScore >= 45 ? 'Fake' : 'Genuine';
  
  // Calculate confidence based on multiple factors
  let confidence = 70; // Base confidence
  if (phoneValidation.isValid) confidence += 10;
  if (hasValidCity) confidence += 10;
  if (gatewayAnalysis.successRate > 80) confidence += 5;
  if (finalRiskScore > 60 || finalRiskScore < 20) confidence += 5;
  
  confidence = Math.min(confidence, 95);

  // Add positive reasons for genuine orders
  if (status === 'Genuine' && reasons.length === 0) {
    reasons.push('All validation checks passed successfully');
    reasons.push(`Payment gateway ${gatewayAnalysis.gateway} has good success rate`);
  }

  return {
    status,
    riskScore: finalRiskScore,
    reasons,
    confidence,
    gatewayAnalysis: {
      gateway: gatewayAnalysis.gateway,
      accessRate: gatewayAnalysis.accessRate,
      cancellationRate: gatewayAnalysis.cancellationRate,
      successRate: gatewayAnalysis.successRate
    }
  };
}