import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Target, Brain, CreditCard } from 'lucide-react';
import { DetectionResult as DetectionResultType } from '../types';

interface DetectionResultProps {
  result: DetectionResultType;
  onNewOrder: () => void;
}

export function DetectionResult({ result, onNewOrder }: DetectionResultProps) {
  const isFake = result.status === 'Fake';
  
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score < 30) return 'bg-green-100';
    if (score < 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
          isFake ? 'bg-red-100' : 'bg-green-100'
        }`}>
          {isFake ? (
            <AlertTriangle className="w-10 h-10 text-red-600" />
          ) : (
            <CheckCircle className="w-10 h-10 text-green-600" />
          )}
        </div>
        
        <h2 className={`text-3xl font-bold mb-2 ${
          isFake ? 'text-red-600' : 'text-green-600'
        }`}>
          {result.status} Order
        </h2>
        
        <p className="text-gray-600 text-lg">
          {isFake 
            ? 'This order shows signs of being fraudulent' 
            : 'This order appears to be legitimate'
          }
        </p>
      </div>

      {/* Risk Score */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Risk Score</span>
          </div>
          <span className={`text-2xl font-bold ${getRiskColor(result.riskScore)}`}>
            {result.riskScore}/100
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${
              result.riskScore < 30 ? 'bg-green-500' :
              result.riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(result.riskScore, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-500">
          <span>Low Risk</span>
          <span>High Risk</span>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Confidence Level</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">
            {result.confidence}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="h-3 rounded-full bg-blue-500 transition-all duration-1000"
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      {/* Detection Reasons */}
      {/* Gateway Analysis */}
      {result.gatewayAnalysis && (
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Payment Gateway Analysis</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{result.gatewayAnalysis.gateway}</div>
              <div className="text-sm text-gray-600">Gateway</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.gatewayAnalysis.accessRate}%</div>
              <div className="text-sm text-gray-600">Access Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{result.gatewayAnalysis.cancellationRate}%</div>
              <div className="text-sm text-gray-600">Cancellation Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{result.gatewayAnalysis.successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Detection Analysis</h3>
        </div>
        
        <div className="space-y-3">
          {result.reasons.map((reason, index) => (
            <div key={index} className={`flex items-start gap-3 p-4 rounded-lg ${
              isFake ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
            }`}>
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isFake ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
              }`}>
                {index + 1}
              </div>
              <p className={`text-sm ${
                isFake ? 'text-red-800' : 'text-green-800'
              }`}>
                {reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onNewOrder}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Analyze Another Order
        </button>
      </div>
    </div>
  );
}