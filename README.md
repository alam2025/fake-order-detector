# Fake Order Detector

A React component library for detecting fake orders in e-commerce applications with Bangladeshi payment gateway integration.

## Features

- 🛡️ **Advanced Detection Logic**: Rule-based algorithm analyzing multiple factors
- 🇧🇩 **Bangladeshi Payment Gateways**: Integration with bKash, Nagad, Rocket, and more
- 📱 **Phone Validation**: Validates Bangladeshi phone number patterns
- 📊 **Analytics Dashboard**: Comprehensive insights and statistics
- 📝 **Order History**: Track and manage analyzed orders
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- ⚡ **TypeScript**: Full type safety and excellent developer experience

## Installation

```bash
npm install fake-order-detector
```

## Quick Start

```tsx
import React from "react";
import { FakeOrderDetector } from "fake-order-detector";

function App() {
  return (
    <div>
      <FakeOrderDetector
        onOrderAnalyzed={(order, result) => {
          console.log("Order analyzed:", order, result);
        }}
      />
    </div>
  );
}
```

## Components

### FakeOrderDetector

The main component that provides a complete interface for order detection.

```tsx
import { FakeOrderDetector } from "fake-order-detector";

<FakeOrderDetector
  className="custom-class"
  showNavigation={true}
  defaultTab="detector"
  onOrderAnalyzed={(order, result) => {
    // Handle analyzed order
  }}
  storageKey="my_custom_storage_key"
/>;
```

### Individual Components

You can also use individual components:

```tsx
import {
  OrderForm,
  DetectionResult,
  OrderHistory,
  AdminDashboard
} from 'fake-order-detector';

// Use components individually
<OrderForm onSubmit={handleSubmit} />
<DetectionResult result={result} onNewOrder={handleNewOrder} />
<OrderHistory orders={orders} onOrdersChange={handleChange} />
<AdminDashboard orders={orders} />
```

## Hooks

### useFakeOrderDetector

A custom hook for managing detection functionality:

```tsx
import { useFakeOrderDetector } from "fake-order-detector";

function MyComponent() {
  const {
    orders,
    isAnalyzing,
    lastResult,
    analyzeOrder,
    removeOrder,
    clearAllOrders,
    analytics,
  } = useFakeOrderDetector();

  const handleAnalyze = async () => {
    const { order, result } = await analyzeOrder({
      customerName: "John Doe",
      phoneNumber: "01712345678",
      address: "Dhaka, Bangladesh",
      paymentMethod: "COD",
    });

    console.log("Analysis complete:", result);
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={isAnalyzing}>
        {isAnalyzing ? "Analyzing..." : "Analyze Order"}
      </button>

      <div>Total Orders: {analytics.totalOrders}</div>
      <div>Fake Percentage: {analytics.fakePercentage}%</div>
    </div>
  );
}
```

## Utilities

### Detection Logic

Use the detection logic directly:

```tsx
import { detectFakeOrder } from "fake-order-detector";

const result = detectFakeOrder(
  "Customer Name",
  "01712345678",
  "Complete Address",
  "COD",
  [] // Previous orders for pattern analysis
);

console.log(result);
// {
//   status: 'Genuine' | 'Fake',
//   riskScore: 25,
//   reasons: ['Valid phone number detected', ...],
//   confidence: 85,
//   gatewayAnalysis: { ... }
// }
```

### Storage Utilities

Manage order storage:

```tsx
import {
  saveOrder,
  getOrders,
  deleteOrder,
  clearOrders,
} from "fake-order-detector";

// Save an order
saveOrder(orderObject);

// Get all orders
const orders = getOrders();

// Delete specific order
deleteOrder("order_id");

// Clear all orders
clearOrders();
```

## Types

```tsx
import type {
  Order,
  DetectionResultType,
  Analytics,
} from "fake-order-detector";

interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  paymentMethod: "COD" | "Prepaid";
  timestamp: Date;
  status: "Genuine" | "Fake";
  riskScore: number;
  detectionReasons: string[];
}
```

## Detection Algorithm

The detection algorithm analyzes:

- **Payment Gateway Performance**: Access rates, cancellation rates, success rates
- **Phone Number Validation**: Bangladeshi operator patterns (GP, Robi, Banglalink, etc.)
- **Address Analysis**: City validation, completeness, suspicious keywords
- **Pattern Recognition**: Duplicate orders, frequency analysis
- **Risk Scoring**: Comprehensive scoring based on multiple factors

### Bangladeshi Payment Gateways Supported

- bKash (95.2% access rate, 12.8% cancellation rate)
- Nagad (92.5% access rate, 15.3% cancellation rate)
- Rocket (88.7% access rate, 18.2% cancellation rate)
- Upay (85.3% access rate, 22.1% cancellation rate)
- SSLCommerz (93.8% access rate, 11.5% cancellation rate)
- AamarPay (90.1% access rate, 16.7% cancellation rate)
- PortWallet (82.4% access rate, 25.6% cancellation rate)

## Styling

The package uses Tailwind CSS. Make sure to include Tailwind in your project:

```bash
npm install tailwindcss
```

Or include the Tailwind CDN in your HTML:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Alam Hossain]

## Support

For support, email dev.alam886@gmail.com or create an issue on GitHub.
# fake-order-detector
