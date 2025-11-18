interface ListItem {
  label: string;
  href: string;
}

interface ListProps {
  items: ListItem[];
  className?: string;
}

export default function List({ items, className = "" }: ListProps) {
  return (
    <ul className={`flex gap-6 ${className}`}>
      {items.map((item, index) => (
        <li key={index}>
          <a
            href={item.href}
            className="text-foreground hover:text-foreground/80 transition-colors font-medium"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
