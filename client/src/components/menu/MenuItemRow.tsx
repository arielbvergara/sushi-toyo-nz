interface MenuItemRowProps {
  name: string;
  price: string;
}

export function MenuItemRow({ name, price }: MenuItemRowProps) {
  return (
    <li
      className="flex items-center justify-between py-3 text-sm"
      style={{ borderBottom: "1px solid #3A3530" }}
    >
      <span style={{ color: "#F5F0E8" }}>{name}</span>
      <span style={{ color: "#9C8E7E" }}>{price}</span>
    </li>
  );
}
