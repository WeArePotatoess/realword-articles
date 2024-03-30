import { useState } from "react";
import { Pagination } from "react-bootstrap";

const Paging = ({ limit = 1, offset = 0, total, size, onSelect }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const items = []
  for (let i = 1; i <= Math.floor(total / limit); i++) {
    items.push(
      <Pagination.Item key={i}
        active={i === currentPage}
        onClick={() => {
          setCurrentPage(i);
          onSelect(i);
        }}
      >
        {i}
      </Pagination.Item>
    )
  }
  return (
    <Pagination size={size || ''}>
      {items}
    </Pagination>
  );
}

export default Paging;