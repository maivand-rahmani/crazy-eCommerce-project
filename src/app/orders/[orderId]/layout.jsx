export const metadata = {
  title: "Order Details | View Order Information",
  description:
    "View detailed information about your order including items purchased, shipping address, payment details, and current status.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Order Details | View Order Information",
    description: "View detailed information about your order.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Order Details | View Order Information",
    description: "View detailed information about your order.",
  },
};

export default function OrderDetailLayout({ children }) {
  return children;
}
