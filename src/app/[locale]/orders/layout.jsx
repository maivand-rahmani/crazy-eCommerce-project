export const metadata = {
  title: "My Orders | Order History & Tracking",
  description:
    "View your complete order history, track shipments, and manage returns. Stay updated on all your past purchases in one place.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "My Orders | Order History & Tracking",
    description: "View your complete order history and track shipments.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "My Orders | Order History & Tracking",
    description: "View your order history and track shipments.",
  },
};

export default function OrdersLayout({ children }) {
  return children;
}
