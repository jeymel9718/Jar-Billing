export type ItemProps = {
  id: string;
  description: string;
  cost: string;
  price: string;
};

export type Price = {
  id: string;
  discountType: "percent" | "amount";
  discount: string;
  subTotal: string;
  total: string;
  name: string;
  number: string;
  email: string;
  date: string;
  orderId: string;
}